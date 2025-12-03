import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPresignedUrl } from '@/lib/s3';

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

// GET - Retrieve student(s)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');
    const email = searchParams.get('email');
    const uin = searchParams.get('uin');

    // Get single student by ID
    if (studentId) {
      const result = await query(
        `SELECT 
          student_id, uin, name, email, degree_type, academic_level,
          program_of_study, graduation_year, need_mentorship, domain_interests,
          target_industries, resume_path, resume_path_key, created_at, updated_at,
          profile_summary, linkedin_url, gpa, skills, is_registrered
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
          resumeUrl = await getPresignedUrl(student.resume_path_key, 3600); // 1 hour
        } catch (error) {
          console.error('Error generating presigned URL:', error);
          resumeUrl = student.resume_path; // Fallback to stored URL
        }
      }

      // Convert resumeUrl to array format
      const resumeUrlArray = (resumeUrl || student.resume_path) 
        ? [resumeUrl || student.resume_path] 
        : [];

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
          resumeUrl: resumeUrlArray, // Return as array
          resumePathKey: student.resume_path_key || '',
          profileSummary: student.profile_summary || '',
          linkedinUrl: student.linkedin_url || '',
          gpa: student.gpa || null,
          skills: parseJsonField(student.skills),
          isRegistered: student.is_registrered === true || student.is_registrered === 'true',
          createdAt: student.created_at,
          updatedAt: student.updated_at,
        },
      });
    }

    // Get single student by email
    if (email) {
      const result = await query(
        `SELECT 
          student_id, uin, name, email, degree_type, academic_level,
          program_of_study, graduation_year, need_mentorship, domain_interests,
          target_industries, resume_path, resume_path_key, created_at, updated_at,
          profile_summary, linkedin_url, gpa, skills, is_registrered
        FROM cmis_students 
        WHERE LOWER(email) = LOWER($1)`,
        [email]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }

      const student = result.rows[0];
      
      let resumeUrl = null;
      if (student.resume_path_key) {
        try {
          resumeUrl = await getPresignedUrl(student.resume_path_key, 3600);
        } catch (error) {
          resumeUrl = student.resume_path;
        }
      }

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
          isRegistered: student.is_registrered === true || student.is_registrered === 'true',
          createdAt: student.created_at,
          updatedAt: student.updated_at,
        },
      });
    }

    // Get single student by UIN
    if (uin) {
      const result = await query(
        `SELECT 
          student_id, uin, name, email, degree_type, academic_level,
          program_of_study, graduation_year, need_mentorship, domain_interests,
          target_industries, resume_path, resume_path_key, created_at, updated_at,
          profile_summary, linkedin_url, gpa, skills, is_registrered
        FROM cmis_students 
        WHERE uin = $1`,
        [uin]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }

      const student = result.rows[0];
      
      let resumeUrl = null;
      if (student.resume_path_key) {
        try {
          resumeUrl = await getPresignedUrl(student.resume_path_key, 3600);
        } catch (error) {
          resumeUrl = student.resume_path;
        }
      }

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
          isRegistered: student.is_registrered === true || student.is_registrered === 'true',
          createdAt: student.created_at,
          updatedAt: student.updated_at,
        },
      });
    }

    // Get all students (with pagination)
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT 
        student_id, uin, name, email, degree_type, academic_level,
        program_of_study, graduation_year, need_mentorship, domain_interests,
        target_industries, resume_path, resume_path_key, profile_summary,
        linkedin_url, gpa, skills, is_registrered
      FROM cmis_students 
      ORDER BY student_id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM cmis_students');
    const total = parseInt(countResult.rows[0].total);

    const students = result.rows.map(student => ({
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
      isRegistered: student.is_registrered === true || student.is_registrered === 'true',
    }));

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get students error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching students.' },
      { status: 500 }
    );
  }
}

