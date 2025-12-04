import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPresignedUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/[id]
 * 
 * Returns a single event by event_id with all its details.
 * 
 * URL Parameter:
 * - id: The event_id of the event to fetch
 * 
 * Response:
 * {
 *   "success": true,
 *   "event": {...}
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Validate event_id
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Parse event_id to number
    const parsedEventId = parseInt(eventId, 10);
    if (isNaN(parsedEventId) || parsedEventId <= 0) {
      return NextResponse.json(
        { error: 'Invalid event ID. Must be a positive number.' },
        { status: 400 }
      );
    }

    // Query event by event_id
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
      WHERE event_id = $1`,
      [parsedEventId]
    );

    // Check if event exists
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const event = result.rows[0];

    // Generate presigned URL for file if file_key exists
    let fileUrl = null;
    if (event.file_key) {
      try {
        fileUrl = await getPresignedUrl(event.file_key, 3600); // 1 hour expiry
      } catch (error) {
        console.error(`Error generating presigned URL for event ${event.event_id}:`, error);
        // Fallback to file_name if presigned URL generation fails
        fileUrl = event.file_name || null;
      }
    }

    // Return event data
    return NextResponse.json({
      success: true,
      event: {
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
        eventEmbedding: event.event_embedding, // Vector embedding (if available)
        aboutEvent: event.about_event,
        eventAgenda: event.event_agenda,
      },
    });
  } catch (error: any) {
    console.error('Get event error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching the event.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

