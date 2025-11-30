import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
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
      fullName,
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
    if (!fullName || !uin || !email || !degreeType || !academicLevel || !graduationYear) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, uin, email, degreeType, academicLevel, graduationYear' },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await query(
      'SELECT student_id, email FROM students WHERE email = $1 OR uin = $2',
      [email.toLowerCase().trim(), uin]
    );

    if (existingStudent.rows.length > 0) {
      return NextResponse.json(
        { error: 'Student with this email or UIN already exists' },
        { status: 409 }
      );
    }

    let resumePath = null;
    let resumePathKey = null;
    let resumeUrl = null;

    // Upload resume to S3 if provided
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
    const domainsArray = typeof domainsOfInterest === 'string'
      ? JSON.parse(domainsOfInterest || '[]')
      : Array.isArray(domainsOfInterest) ? domainsOfInterest : [];

    const industriesArray = typeof targetIndustries === 'string'
      ? JSON.parse(targetIndustries || '[]')
      : Array.isArray(targetIndustries) ? targetIndustries : [];

    const skillsArray = typeof skills === 'string'
      ? JSON.parse(skills || '[]')
      : Array.isArray(skills) ? skills : [];

    // Insert student into database
    const result = await query(
      `INSERT INTO students (
        uin, name, email, degree_type, academic_level, program_of_study,
        graduation_year, need_mentorship, domain_interests, target_industries,
        resume_path, resume_path_key, password, created_by, updated_by,
        profile_summary, linkedin_url, gpa, skills
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING student_id, uin, name, email, degree_type, academic_level,
        program_of_study, graduation_year, need_mentorship, domain_interests,
        target_industries, resume_path, resume_path_key, profile_summary,
        linkedin_url, gpa, skills`,
      [
        uin,
        fullName,
        email.toLowerCase().trim(),
        degreeType,
        academicLevel,
        programOfStudy || null,
        parseInt(graduationYear),
        needsMentor === 'true' || needsMentor === true,
        JSON.stringify(domainsArray),
        JSON.stringify(industriesArray),
        resumePath,
        resumePathKey,
        hashedPassword,
        email.toLowerCase().trim(), // created_by
        email.toLowerCase().trim(), // updated_by
        profileSummary || null,
        linkedinUrl || null,
        gpa ? parseFloat(gpa) : null,
        JSON.stringify(skillsArray),
      ]
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
        resumeUrl: student.resume_path || '',
        resumePathKey: student.resume_path_key || '',
        profileSummary: student.profile_summary || '',
        linkedinUrl: student.linkedin_url || '',
        gpa: student.gpa || null,
        skills: parseJsonField(student.skills),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}

