"use client";

import Navigation from "@/components/Navigation";
import { fetchEventById } from "@/lib/api/events";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notification-context";
import { formatTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function getEventImage(title: string): string {
  const titleLower = title.toLowerCase();
  // Match specific event types based on title
  if (titleLower.includes("data engineering")) {
    return "/data-engineering.jpg";
  } else if (titleLower.includes("product management") || titleLower.includes("product manager")) {
    return "/product-management.jpg";
  } else if (title.includes("Software Engineering Case Competition") || titleLower.includes("software engineer")) {
    return "/software-engineering.jpg";
  } else if (titleLower.includes("cmis case competition") || titleLower.includes("cmis case competition")) {
    return "/cmis.jpg";
  }
  
  // Default fallback image
  return "/cmis.jpg";
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", params?.id],
    queryFn: async () => {
      try {
        const event = await fetchEventById(`${params?.id}`);
        console.log("Fetched events:", event);
        return event?.event as any;
      } catch (error) {
        toast.error("Failed to load events.");
        throw error;
      }
    },
  });

  const handleRegister = () => {
    if (!user) return;

    // event.attendees.push(user.id);
    // setIsRegistered(true);

    addNotification({
      userId: user.id,
      type: "event_registration",
      title: "Registration Confirmed",
      message: `You're registered for ${event?.title} on ${new Date(
        event?.date
      ).toLocaleDateString()}.`,
      actionUrl: `/events/${event?.id}`,
      actionText: "View Event",
      icon: "✅",
    });

    toast.success(`Successfully registered for ${event?.title}!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-24 mb-6 animate-pulse"></div>
          <div className="h-96 bg-gray-200 rounded-xl mb-8 animate-pulse"></div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>

        {/* Event Header Image */}
        <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={getEventImage(event?.title)}
            alt={`${event?.title}`}
            fill
            className="object-cover"
          />
          {new Date(`${event?.eventDate}`).getTime() < Date.now() && (
            <div className="absolute top-6 right-6 bg-gray-900/80 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Past Event
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Event Title and Meta */}
          <div className="mb-6">
            {/* <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-maroon-50 text-maroon-700 text-sm rounded-full font-medium"
                >
                  {tag.replace(/_/g, " ")}
                </span>
              ))}
            </div> */}

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(`${event?.eventDate}`).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(event?.startTime)} - {formatTime(event?.endTime)}
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.locationType}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {event?.description}
            </p>
          </div>

          {/* Agenda */}
          {event?.eventAgenda && event?.eventAgenda?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda</h2>
              <div className="space-y-3">
                {event?.eventAgenda?.map((item: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-maroon-500 rounded-full mt-2 mr-3" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ):(<></>)
        }

          {/* Speakers */}
          {/* {event.speakers && event.speakers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Speakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {speaker.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                      <p className="text-sm text-maroon-600">
                        {speaker.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Registration CTA */}
          {!(new Date(event?.eventDate).getTime() < Date.now()) && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {event?.attendees?.length ?? 0}{" "}
                    {event?.attendees?.length === 1 ? "person" : "people"}{" "}
                    registered
                  </p>
                  {/* {isRegistered && (
                    <p className="text-green-600 font-medium">
                      ✓ You&apos;re registered for this event
                    </p>
                  )} */}
                </div>
                {/* <button
                  onClick={handleRegister}
                  disabled={isRegistered}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isRegistered
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-maroon-500 text-white hover:bg-maroon-600"
                  }`}
                >
                  {isRegistered ? "✓ Registered" : "Register for Event"}
                </button> */}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
