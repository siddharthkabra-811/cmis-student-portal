import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint to trigger n8n pipeline
 * 
 * Frontend should call: POST /api/webhook/n8n
 * Body: { student_id: number }
 * 
 * This will forward the request to the n8n webhook URL configured in environment variables
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id } = body;

    // Validate student_id
    if (!student_id) {
      return NextResponse.json(
        { error: 'student_id is required' },
        { status: 400 }
      );
    }

    // Validate student_id is a number
    const studentId = typeof student_id === 'string' ? parseInt(student_id, 10) : student_id;
    if (isNaN(studentId) || studentId <= 0) {
      return NextResponse.json(
        { error: 'student_id must be a valid positive number' },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured in environment variables');
      return NextResponse.json(
        { error: 'Webhook service is not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    console.log(`Triggering n8n webhook for student_id: ${studentId}`);

    // Forward the request to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        timestamp: new Date().toISOString(),
        source: 'cmis-student-portal',
      }),
    });

    // Check if n8n webhook responded successfully
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n webhook error:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: 'Failed to trigger n8n pipeline',
          details: `n8n returned status ${n8nResponse.status}`,
        },
        { status: 502 } // Bad Gateway - upstream service error
      );
    }

    // Try to parse n8n response
    let n8nData;
    try {
      n8nData = await n8nResponse.json();
    } catch {
      // If response is not JSON, that's okay - n8n might return empty or text
      n8nData = { message: 'Pipeline triggered successfully' };
    }

    console.log('n8n webhook triggered successfully:', n8nData);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'n8n pipeline triggered successfully',
      student_id: studentId,
      n8n_response: n8nData,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while triggering the webhook',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Also support GET for testing (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const student_id = searchParams.get('student_id');

  if (!student_id) {
    return NextResponse.json(
      { error: 'student_id query parameter is required' },
      { status: 400 }
    );
  }

  // Convert to POST request internally
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id }),
  });

  return POST(mockRequest);
}

