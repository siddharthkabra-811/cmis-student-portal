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
    
    console.log('Attempting to query database for email:', email);

    // Query the database for the student
    const result = await query(
      `SELECT 
        student_id, 
        uin, 
        name, 
        email, 
        degreee_type, 
        academic_level, 
        program_of_study, 
        graduation_year, 
        need_mentorship, 
        domain_interests, 
        target_industries, 
        resume_path, 
        resume_path_key,
        password
      FROM students 
      WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const student = result.rows[0];

    // Check if password exists (for existing records that might not have passwords)
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

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = student;

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

    // Return student data (in production, you might want to generate a JWT token here)
    return NextResponse.json({
      success: true,
      student: {
        id: student.student_id,
        uin: student.uin,
        name: student.name,
        email: student.email,
        degreeType: student.degreee_type,
        academicLevel: student.academic_level,
        programOfStudy: student.program_of_study,
        graduationYear: student.graduation_year,
        needsMentor: student.need_mentorship || false,
        domainsOfInterest: parseJsonField(student.domain_interests),
        targetIndustries: parseJsonField(student.target_industries),
        resumeUrl: student.resume_path || '',
        resumePathKey: student.resume_path_key || '',
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

