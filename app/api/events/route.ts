import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPresignedUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events
 * 
 * Returns all events from the events table with their details.
 * 
 * Query Parameters (optional):
 * - page: Page number for pagination (default: 1)
 * - limit: Number of events per page (default: 50)
 * - upcoming: Filter for upcoming events only (true/false)
 * 
 * Response:
 * {
 *   "success": true,
 *   "events": [...],
 *   "pagination": {...}
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const upcomingOnly = searchParams.get('upcoming') === 'true';
    const offset = (page - 1) * limit;

    // Build query based on filters
    let whereClause = '';
    let queryParams: any[] = [limit, offset];

    if (upcomingOnly) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      whereClause = 'WHERE event_date >= $3';
      queryParams = [limit, offset, today];
    }

    // Get events with all columns
    const result = await query(
      `SELECT 
        event_id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        location_type,
        file_name,
        event_summary,
        event_embedding,
        file_key,
        about_event,
        event_agenda
      FROM events 
      ${whereClause}
      ORDER BY event_date DESC, start_time DESC
      LIMIT $1 OFFSET $2`,
      queryParams
    );

    // Get total count for pagination
    const countQuery = upcomingOnly
      ? 'SELECT COUNT(*) as total FROM events WHERE event_date >= $1'
      : 'SELECT COUNT(*) as total FROM events';
    
    const countParams = upcomingOnly 
      ? [new Date().toISOString().split('T')[0]]
      : [];

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Process events and generate presigned URLs for files if needed
    const events = await Promise.all(
      result.rows.map(async (event) => {
        let fileUrl = null;

        // Generate presigned URL for file if file_key exists
        if (event.file_key) {
          try {
            fileUrl = await getPresignedUrl(event.file_key, 3600); // 1 hour expiry
          } catch (error) {
            console.error(`Error generating presigned URL for event ${event.event_id}:`, error);
            // Fallback to file_name if presigned URL generation fails
            fileUrl = event.file_name || null;
          }
        }

        return {
          id: event.event_id,
          title: event.title,
          description: event.description,
          eventDate: event.event_date,
          startTime: event.start_time,
          endTime: event.end_time,
          locationType: event.location_type,
          fileName: event.file_name,
          fileUrl: fileUrl, // Presigned URL or null
          fileKey: event.file_key,
          eventSummary: event.event_summary,
          eventEmbedding: event.event_embedding, // Vector embedding (if needed)
          aboutEvent: event.about_event,
          eventAgenda: event.event_agenda,
        };
      })
    );

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while fetching events.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

