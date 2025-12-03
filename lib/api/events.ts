import { Event } from "@/lib/types";

// API Event Response Type (matches backend response)
export interface ApiEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  locationType: string | null;
  fileName: string | null;
  fileUrl: string | null;
  fileKey: string | null;
  eventSummary: string | null;
  eventEmbedding: any;
  aboutEvent: string | null;
  eventAgenda: string | null;
}

// API Response Type
export interface EventsApiResponse {
  success: boolean;
  events: ApiEvent[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EventApiResponse {
  success: boolean;
  event: ApiEvent;
}

/**
 * Fetch all events from the API
 */
export async function fetchEvents(options?: {
  page?: number;
  limit?: number;
  upcoming?: boolean;
}): Promise<EventsApiResponse> {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.upcoming) params.append("upcoming", "true");

  const url = `/api/events${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch events" }));
    throw new Error(error.error || "Failed to fetch events");
  }

  return response.json();
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(eventId: string | number): Promise<EventApiResponse> {
  const response = await fetch(`/api/events/${eventId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch event" }));
    throw new Error(error.error || "Failed to fetch event");
  }

  return response.json();
}

/**
 * Convert API event to frontend Event format
 */
export function mapApiEventToEvent(apiEvent: ApiEvent): Event {
  const eventDate = new Date(apiEvent.eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = eventDate < today;

  // Format time string
  let timeString = "";
  if (apiEvent.startTime && apiEvent.endTime) {
    const startTime = formatTime(apiEvent.startTime);
    const endTime = formatTime(apiEvent.endTime);
    timeString = `${startTime} - ${endTime}`;
  } else if (apiEvent.startTime) {
    timeString = formatTime(apiEvent.startTime);
  }

  // Parse agenda if it's a string (could be JSON or newline-separated)
  let agenda: string[] = [];
  if (apiEvent.eventAgenda) {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(apiEvent.eventAgenda);
      if (Array.isArray(parsed)) {
        agenda = parsed;
      }
    } catch {
      // If not JSON, split by newlines
      agenda = apiEvent.eventAgenda
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
  }

  // Use fileUrl as image if available, otherwise use a placeholder
  const imageUrl =
    apiEvent.fileUrl ||
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop";

  // Use aboutEvent as fullDescription if available, otherwise use description
  const fullDescription = apiEvent.aboutEvent || apiEvent.description || "";

  // Extract tags from locationType or use default
  const tags = apiEvent.locationType ? [apiEvent.locationType] : ["event"];

  return {
    id: apiEvent.id.toString(),
    title: apiEvent.title,
    date: apiEvent.eventDate,
    time: timeString,
    image: imageUrl,
    description: apiEvent.description || "",
    fullDescription: fullDescription,
    location: apiEvent.locationType || "TBA",
    tags: tags,
    agenda: agenda.length > 0 ? agenda : undefined,
    speakers: [], // API doesn't provide speakers yet
    attendees: [], // API doesn't provide attendees yet
    isPast: isPast,
  };
}

/**
 * Format time string (HH:MM:SS or HH:MM to HH:MM AM/PM)
 */
function formatTime(timeString: string): string {
  try {
    // Handle formats like "18:00:00" or "18:00"
    const parts = timeString.split(":");
    const hours = parseInt(parts[0], 10);
    let minutes = parts[1] || "00";
    
    // Remove seconds if present
    if (minutes.includes(":")) {
      minutes = minutes.split(":")[0];
    }
    
    // Ensure minutes are 2 digits
    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }

    if (isNaN(hours)) {
      return timeString;
    }

    if (hours === 0) {
      return `12:${minutes} AM`;
    } else if (hours < 12) {
      return `${hours}:${minutes} AM`;
    } else if (hours === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hours - 12}:${minutes} PM`;
    }
  } catch {
    return timeString;
  }
}

