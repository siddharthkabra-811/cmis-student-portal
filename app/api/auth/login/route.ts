import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    const body = await request.json();
    console.log('Request body:', body);
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    console.log('Attempting to authenticate with cmis_students table for email:', email);

    // Fetch student data from cmis_students table using the email
    const result = await query(
      `SELECT 
        student_id, 
        uin, 
        name,
        email, 
        degree_type, 
        academic_level, 
        program_of_study, 
        graduation_year, 
        need_mentorship, 
        domain_interests, 
        target_industries, 
        resume_path, 
        resume_path_key,
        created_at,
        updated_at,
        profile_summary,
        profile_summary_embedding,
        linkedin_url,
        gpa,
        skills,
        password,
        is_registrered
      FROM cmis_students 
      WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    // If student doesn't exist
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const student = result.rows[0];

    // Check if password exists
    if (!student.password) {
      return NextResponse.json(
        { error: 'Account not properly set up. Please contact administrator.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Authentication successful');

    // Helper function to parse JSON fields (they might be stored as JSON strings or arrays)
    const parseJsonField = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // If it's not valid JSON, treat as comma-separated string
          return field.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Helper function to parse skills (can be JSON array or comma-separated string)
    const parseSkills = (field: any): string[] => {
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

    // Convert resumeUrl to array format
    const resumeUrlArray = student.resume_path 
      ? [student.resume_path] 
      : [];

    // Return student data (in production, you might want to generate a JWT token here)
    return NextResponse.json({
      success: true,
      student: {
        id: student.student_id,
        uin: student.uin,
        name: student.name || email.split('@')[0] || 'User',
        email: student.email,
        degreeType: student.degree_type,
        academicLevel: student.academic_level,
        programOfStudy: student.program_of_study,
        graduationYear: student.graduation_year,
        needsMentor: student.need_mentorship || false,
        domainsOfInterest: parseJsonField(student.domain_interests),
        targetIndustries: parseJsonField(student.target_industries),
        resumeUrl: resumeUrlArray, // Return as array
        resumePathKey: student.resume_path_key || '',
        profileSummary: student.profile_summary || '',
        linkedinUrl: student.linkedin_url || '',
        gpa: student.gpa || null,
        skills: parseSkills(student.skills),
        isRegistered: student.is_registrered === true || student.is_registrered === 'true',
        createdAt: student.created_at,
        updatedAt: student.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}

