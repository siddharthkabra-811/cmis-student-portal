import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadToS3, deleteFromS3, getPresignedUrl } from '@/lib/s3';
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

// GET - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id;

    const result = await query(
      `SELECT 
        student_id, uin, name, email, degree_type, academic_level,
        program_of_study, graduation_year, need_mentorship, domain_interests,
        target_industries, resume_path, resume_path_key, created_by, updated_by,
        profile_summary, linkedin_url, gpa, skills
      FROM cmis_students 
      WHERE student_id = $1`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const student = result.rows[0];
    
    // Generate presigned URL for resume if exists
    let resumeUrl = null;
    if (student.resume_path_key) {
      try {
        resumeUrl = await getPresignedUrl(student.resume_path_key, 3600);
      } catch (error) {
        resumeUrl = student.resume_path;
      }
    }

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

    return NextResponse.json({
      success: true,
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
        resumeUrl: resumeUrl || student.resume_path || '',
        resumePathKey: student.resume_path_key || '',
        profileSummary: student.profile_summary || '',
        linkedinUrl: student.linkedin_url || '',
        gpa: student.gpa || null,
        skills: parseJsonField(student.skills),
        createdBy: student.created_by,
        updatedBy: student.updated_by,
      },
    });
  } catch (error: any) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching student.' },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateStudent(request, params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateStudent(request, params.id);
}

async function updateStudent(request: NextRequest, studentId: string) {
  try {
    console.log('Update student API called for ID:', studentId);

    // Check if student exists
    const existingStudent = await query(
      'SELECT student_id, resume_path_key, email FROM cmis_students WHERE student_id = $1',
      [studentId]
    );

    if (existingStudent.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check content type to determine if it's form data or JSON
    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    let resumeFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const parsed = await parseFormData(request);
      data = parsed.data;
      resumeFile = parsed.resumeFile;
    } else {
      // Handle JSON request
      data = await request.json();
    }
    const oldResumeKey = existingStudent.rows[0].resume_path_key;

    // Extract fields
    const {
      fullName,
      uin,
      email,
      degreeType,
      academicLevel,
      graduationYear,
      domainsOfInterest,
      targetIndustries,
      needsMentor,
      password,
      programOfStudy,
      profileSummary,
      linkedinUrl,
      gpa,
      skills,
      replaceResume, // Flag to indicate if resume should be replaced
    } = data;

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (fullName !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      updateValues.push(fullName);
    }
    if (uin !== undefined) {
      // Check if UIN is already taken by another student
      const uinCheck = await query(
        'SELECT student_id FROM cmis_students WHERE uin = $1 AND student_id != $2',
        [uin, studentId]
      );
      if (uinCheck.rows.length > 0) {
        return NextResponse.json(
          { error: 'UIN already exists for another student' },
          { status: 409 }
        );
      }
      updateFields.push(`uin = $${paramIndex++}`);
      updateValues.push(uin);
    }
    if (email !== undefined) {
      // Check if email is already taken by another student
      const emailCheck = await query(
        'SELECT student_id FROM cmis_students WHERE LOWER(email) = LOWER($1) AND student_id != $2',
        [email, studentId]
      );
      if (emailCheck.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email already exists for another student' },
          { status: 409 }
        );
      }
      updateFields.push(`email = $${paramIndex++}`);
      updateValues.push(email.toLowerCase().trim());
    }
    if (degreeType !== undefined) {
      updateFields.push(`degree_type = $${paramIndex++}`);
      updateValues.push(degreeType);
    }
    if (academicLevel !== undefined) {
      updateFields.push(`academic_level = $${paramIndex++}`);
      updateValues.push(academicLevel);
    }
    if (programOfStudy !== undefined) {
      updateFields.push(`program_of_study = $${paramIndex++}`);
      updateValues.push(programOfStudy || null);
    }
    if (graduationYear !== undefined) {
      updateFields.push(`graduation_year = $${paramIndex++}`);
      updateValues.push(parseInt(graduationYear));
    }
    if (needsMentor !== undefined) {
      updateFields.push(`need_mentorship = $${paramIndex++}`);
      updateValues.push(needsMentor === 'true' || needsMentor === true);
    }
    if (domainsOfInterest !== undefined) {
      const domainsArray = typeof domainsOfInterest === 'string'
        ? JSON.parse(domainsOfInterest || '[]')
        : Array.isArray(domainsOfInterest) ? domainsOfInterest : [];
      updateFields.push(`domain_interests = $${paramIndex++}`);
      updateValues.push(JSON.stringify(domainsArray));
    }
    if (targetIndustries !== undefined) {
      const industriesArray = typeof targetIndustries === 'string'
        ? JSON.parse(targetIndustries || '[]')
        : Array.isArray(targetIndustries) ? targetIndustries : [];
      updateFields.push(`target_industries = $${paramIndex++}`);
      updateValues.push(JSON.stringify(industriesArray));
    }
    if (password !== undefined && password !== '') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
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
    if (skills !== undefined) {
      const skillsArray = typeof skills === 'string'
        ? JSON.parse(skills || '[]')
        : Array.isArray(skills) ? skills : [];
      updateFields.push(`skills = $${paramIndex++}`);
      updateValues.push(JSON.stringify(skillsArray));
    }

    // Handle resume upload
    let resumePath = null;
    let resumePathKey = null;
    let resumeUrl = null;

    if (resumeFile && resumeFile.size > 0) {
      try {
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
        const maxSize = 10 * 1024 * 1024;
        if (fileBuffer.length > maxSize) {
          return NextResponse.json(
            { error: 'File size exceeds 10MB limit.' },
            { status: 400 }
          );
        }

        // Delete old resume if exists and replaceResume is true
        if (oldResumeKey && (replaceResume === 'true' || replaceResume === true)) {
          try {
            await deleteFromS3(oldResumeKey);
          } catch (deleteError) {
            console.error('Error deleting old resume:', deleteError);
            // Continue even if delete fails
          }
        }

        const uploadResult = await uploadToS3(fileBuffer, fileName, 'resumes', contentType);
        resumePath = uploadResult.url;
        resumePathKey = uploadResult.key;
        resumeUrl = uploadResult.url;

        updateFields.push(`resume_path = $${paramIndex++}`);
        updateValues.push(resumePath);
        updateFields.push(`resume_path_key = $${paramIndex++}`);
        updateValues.push(resumePathKey);
      } catch (s3Error: any) {
        console.error('S3 upload error:', s3Error);
        return NextResponse.json(
          { error: 'Failed to upload resume. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Always update updated_by
    updateFields.push(`updated_by = $${paramIndex++}`);
    updateValues.push(data.email || existingStudent.rows[0].email);

    if (updateFields.length === 1) {
      // Only updated_by was added, no actual fields to update
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add student_id to the end for WHERE clause
    updateValues.push(studentId);

    const updateQuery = `
      UPDATE cmis_students 
      SET ${updateFields.join(', ')}
      WHERE student_id = $${paramIndex}
      RETURNING student_id, uin, name, email, degree_type, academic_level,
        program_of_study, graduation_year, need_mentorship, domain_interests,
        target_industries, resume_path, resume_path_key, profile_summary,
        linkedin_url, gpa, skills
    `;

    const result = await query(updateQuery, updateValues);
    const student = result.rows[0];

    // Generate presigned URL for resume if exists
    let finalResumeUrl = resumeUrl;
    if (!finalResumeUrl && student.resume_path_key) {
      try {
        finalResumeUrl = await getPresignedUrl(student.resume_path_key, 3600);
      } catch (error) {
        finalResumeUrl = student.resume_path;
      }
    }

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

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
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
        resumeUrl: finalResumeUrl || student.resume_path || '',
        resumePathKey: student.resume_path_key || '',
        profileSummary: student.profile_summary || '',
        linkedinUrl: student.linkedin_url || '',
        gpa: student.gpa || null,
        skills: parseJsonField(student.skills),
      },
    });
  } catch (error: any) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating student.' },
      { status: 500 }
    );
  }
}

