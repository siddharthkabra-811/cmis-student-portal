import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';
import bcrypt from 'bcryptjs';

// Helper to parse form data with file upload
async function parseFormData(request: NextRequest) {
  const formData = await request.formData();
  const data: any = {};
  let resumeFile: File | null = null;

  for (const [key, value] of formData.entries()) {
    if (key === 'resume' && value instanceof File) {
      resumeFile = value;
    } else {
      data[key] = value;
    }
  }

  return { data, resumeFile };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const { data, resumeFile } = await parseFormData(request);

    // Extract and validate required fields
    const {
      name,
      uin,
      email,
      degreeType,
      academicLevel,
      graduationYear,
      domainsOfInterest,
      targetIndustries,
      needsMentor,
      password, // Optional - for new registrations
      programOfStudy, // Optional
      profileSummary, // Optional
      linkedinUrl, // Optional
      gpa, // Optional
      skills, // Optional
    } = data;

    // Validate required fields
    if (!name || !uin || !email || !degreeType || !academicLevel || !graduationYear) {
      return NextResponse.json(
        { error: 'Missing required fields: name, uin, email, degreeType, academicLevel, graduationYear' },
        { status: 400 }
      );
    }

    // Validate degreeType - check against common values
    // The database has a check constraint that may only allow specific values
    const validDegreeTypes = ['MS', 'PhD', 'MBA', 'BS', 'Masters', 'Ph.D', 'Bachelor'];
    // Note: If this fails, check your database constraint for exact allowed values
    // Run: SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'students_degree_type_check';

    // Check if student exists (by email or UIN) - we need to UPDATE, not INSERT
    const existingStudent = await query(
      'SELECT student_id, email, resume_path_key FROM cmis_students WHERE email = $1 OR uin = $2',
      [email.toLowerCase().trim(), uin]
    );

    if (existingStudent.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found. Please contact administrator to create your account first.' },
        { status: 404 }
      );
    }

    const studentId = existingStudent.rows[0].student_id;
    const oldResumeKey = existingStudent.rows[0].resume_path_key;

    let resumePath = null;
    let resumePathKey = null;
    let resumeUrl = null;

    // Upload resume to S3 if provided
    if (resumeFile && resumeFile.size > 0) {
      try {
        // Delete old resume from S3 if it exists
        if (oldResumeKey) {
          try {
            await deleteFromS3(oldResumeKey);
          } catch (deleteError) {
            console.error('Error deleting old resume from S3:', deleteError);
            // Continue even if deletion fails
          }
        }

        const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
        const fileName = resumeFile.name;
        const contentType = resumeFile.type || 'application/pdf';

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(contentType)) {
          return NextResponse.json(
            { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
            { status: 400 }
          );
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (fileBuffer.length > maxSize) {
          return NextResponse.json(
            { error: 'File size exceeds 10MB limit.' },
            { status: 400 }
          );
        }

        const uploadResult = await uploadToS3(fileBuffer, fileName, 'resumes', contentType);
        resumePath = uploadResult.url;
        resumePathKey = uploadResult.key;
        resumeUrl = uploadResult.url;
      } catch (s3Error: any) {
        console.error('S3 upload error:', s3Error);
        return NextResponse.json(
          { error: 'Failed to upload resume. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Parse arrays (they come as strings from form data)
    let domainsArray: any[] = [];
    let industriesArray: any[] = [];
    let skillsArray: any[] = [];

    try {
      domainsArray = typeof domainsOfInterest === 'string'
        ? JSON.parse(domainsOfInterest || '[]')
        : Array.isArray(domainsOfInterest) ? domainsOfInterest : [];
    } catch (e) {
      console.error('Error parsing domainsOfInterest:', e);
      return NextResponse.json(
        { error: 'Invalid domainsOfInterest format. Expected JSON array.' },
        { status: 400 }
      );
    }

    try {
      industriesArray = typeof targetIndustries === 'string'
        ? JSON.parse(targetIndustries || '[]')
        : Array.isArray(targetIndustries) ? targetIndustries : [];
    } catch (e) {
      console.error('Error parsing targetIndustries:', e);
      return NextResponse.json(
        { error: 'Invalid targetIndustries format. Expected JSON array.' },
        { status: 400 }
      );
    }

    try {
      skillsArray = typeof skills === 'string'
        ? JSON.parse(skills || '[]')
        : Array.isArray(skills) ? skills : [];
    } catch (e) {
      console.error('Error parsing skills:', e);
      return NextResponse.json(
        { error: 'Invalid skills format. Expected JSON array.' },
        { status: 400 }
      );
    }

    // Pass JavaScript arrays directly - pg library will convert to PostgreSQL array format
    // Empty array [] → PostgreSQL {} (empty array)
    // Array with values ["item1","item2"] → PostgreSQL {"item1","item2"}
    
    // Build UPDATE query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    updateFields.push(`name = $${paramIndex++}`);
    updateValues.push(name);

    updateFields.push(`degree_type = $${paramIndex++}`);
    updateValues.push(degreeType);

    updateFields.push(`academic_level = $${paramIndex++}`);
    updateValues.push(academicLevel);

    if (programOfStudy !== undefined) {
      updateFields.push(`program_of_study = $${paramIndex++}`);
      updateValues.push(programOfStudy || null);
    }

    updateFields.push(`graduation_year = $${paramIndex++}`);
    updateValues.push(parseInt(graduationYear));

    updateFields.push(`need_mentorship = $${paramIndex++}`);
    updateValues.push(needsMentor === 'true' || needsMentor === true);

    updateFields.push(`domain_interests = $${paramIndex++}`);
    updateValues.push(domainsArray);

    updateFields.push(`target_industries = $${paramIndex++}`);
    updateValues.push(industriesArray);

    if (resumePath !== null) {
      updateFields.push(`resume_path = $${paramIndex++}`);
      updateValues.push(resumePath);
    }

    if (resumePathKey !== null) {
      updateFields.push(`resume_path_key = $${paramIndex++}`);
      updateValues.push(resumePathKey);
    }

    if (hashedPassword !== null) {
      updateFields.push(`password = $${paramIndex++}`);
      updateValues.push(hashedPassword);
    }

    if (profileSummary !== undefined) {
      updateFields.push(`profile_summary = $${paramIndex++}`);
      updateValues.push(profileSummary || null);
    }

    if (linkedinUrl !== undefined) {
      updateFields.push(`linkedin_url = $${paramIndex++}`);
      updateValues.push(linkedinUrl || null);
    }

    if (gpa !== undefined) {
      updateFields.push(`gpa = $${paramIndex++}`);
      updateValues.push(gpa ? parseFloat(gpa) : null);
    }

    if (skillsArray.length > 0 || skills !== undefined) {
      updateFields.push(`skills = $${paramIndex++}`);
      updateValues.push(skillsArray);
    }

    updateFields.push(`is_registrered = $${paramIndex++}`);
    updateValues.push(true);

    updateFields.push(`updated_at = NOW()`);

    // Add student_id for WHERE clause
    updateValues.push(studentId);

    // Update student in database
    const result = await query(
      `UPDATE cmis_students 
       SET ${updateFields.join(', ')}
       WHERE student_id = $${paramIndex}
       RETURNING student_id, uin, name, email, degree_type, academic_level,
         program_of_study, graduation_year, need_mentorship, domain_interests,
         target_industries, resume_path, resume_path_key, profile_summary,
         linkedin_url, gpa, skills, is_registrered, created_at, updated_at`,
      updateValues
    );

    const student = result.rows[0];

    // Helper function to parse JSON fields
    const parseJsonField = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return field.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Return student data
    // Convert resume_path to array format
    const resumePathArray = student.resume_path 
      ? [student.resume_path] 
      : [];

    return NextResponse.json({
      success: true,
      message: 'Student registered successfully',
      student: {
        id: student.student_id,
        uin: student.uin,
        name: student.name,
        email: student.email,
        degreeType: student.degree_type,
        academicLevel: student.academic_level,
        programOfStudy: student.program_of_study,
        graduationYear: student.graduation_year,
        needsMentor: student.need_mentorship,
        domainsOfInterest: parseJsonField(student.domain_interests),
        targetIndustries: parseJsonField(student.target_industries),
        resumeUrl: resumePathArray, // Return as array
        resumePathKey: student.resume_path_key || '',
        profileSummary: student.profile_summary || '',
        linkedinUrl: student.linkedin_url || '',
        gpa: student.gpa || null,
        skills: parseJsonField(student.skills),
        isRegistered: student.is_registrered === true || student.is_registrered === 'true',
        createdAt: student.created_at,
        updatedAt: student.updated_at,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      constraint: error?.constraint,
      stack: error?.stack,
    });
    
    // Handle check constraint violations with helpful messages
    if (error?.code === '23514' && error?.constraint) {
      let helpfulMessage = error?.message || 'Validation error';
      
      if (error.constraint === 'students_degree_type_check') {
        helpfulMessage = 'Invalid degree type. Please check the allowed values in your database. Common values: MS, PhD, MBA, BS. Run this SQL to check: SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = \'students_degree_type_check\';';
      }
      
      return NextResponse.json(
        { 
          error: helpfulMessage,
          ...(process.env.NODE_ENV === 'development' && { 
            details: error?.detail,
            code: error?.code,
            constraint: error?.constraint,
            hint: 'Check your database constraint definition for allowed values'
          })
        },
        { status: 400 }
      );
    }
    
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || error?.detail || 'An error occurred during registration. Please try again.'
      : 'An error occurred during registration. Please try again.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          details: error?.detail,
          code: error?.code,
          constraint: error?.constraint,
        })
      },
      { status: 500 }
    );
  }
}

