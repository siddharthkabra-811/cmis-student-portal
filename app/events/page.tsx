"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth-context";
import { dummyEvents } from "@/lib/data";
import { useNotifications } from "@/lib/notification-context";
import { Event } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(dummyEvents);

  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Discover and register for CMIS events</p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No upcoming events at this time.
            </p>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function EventCard({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(
    event.attendees.includes(user?.id || "")
  );

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;

    // Add user to attendees
    event.attendees.push(user.id);
    setIsRegistered(true);

    // Create notification
    addNotification({
      userId: user.id,
      type: "event_registration",
      title: "Registration Confirmed",
      message: `You're registered for ${event.title} on ${new Date(
        event.date
      ).toLocaleDateString()}.`,
      actionUrl: `/events/${event.id}`,
      actionText: "View Event",
      icon: "✅",
    });

    // Show success message
    alert(`Successfully registered for ${event.title}!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
      <Link href={`/events/${event.id}`}>
        <div className="relative h-48 bg-gray-200">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          {isPast && (
            <div className="absolute top-3 right-3 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Past Event
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg
              className="w-4 h-4 mr-1"
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
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            <span className="mx-2">•</span>
            <svg
              className="w-4 h-4 mr-1"
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
            {event.time}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-maroon-600 transition">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-maroon-50 text-maroon-700 text-xs rounded-full"
              >
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6 flex gap-3">
        {!isPast && (
          <button
            onClick={handleRegister}
            disabled={isRegistered}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              isRegistered
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-maroon-500 text-white hover:bg-maroon-600"
            }`}
          >
            {isRegistered ? "✓ Registered" : "Register"}
          </button>
        )}
        <Link
          href={`/events/${event.id}`}
          className="flex-1 py-2 px-4 border-2 border-maroon-500 text-maroon-600 rounded-lg font-semibold hover:bg-maroon-50 transition text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
