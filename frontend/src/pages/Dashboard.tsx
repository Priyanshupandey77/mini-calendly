import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Event } from "../types/api.types";
import { deleteEvent, getEvents } from "../services/event.service";
import axios from "axios";

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [copiedEventId, setCopiedEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Failed to delete event");
      } else {
        setError("Failed to delete event");
      }
    }
  };

  const handleCopyLink = async (bookingUrl: string, eventId: number) => {
    await navigator.clipboard.writeText(bookingUrl);

    setCopiedEventId(eventId);

    setTimeout(() => {
      setCopiedEventId(null);
    }, 2000);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setIsLoading(false);
      } catch (error) {
        setError("Something went wrong.");
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-medium text-indigo-600">Dashboard</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your events and availability from one place.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Events</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {events.length}
          </p>

          <p className="mt-1 text-sm text-slate-400">Events you've created</p>
        </div>
      </section>

      {/* Events */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage your scheduling links.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Event
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading events...</p>
          </div>
        )}

        {/* Events */}
        {!isLoading && !error && events.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {events.map((event) => {
              const bookingUrl = `${window.location.origin}/book/${event.slug}`;
              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-900">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {event.duration} min
                    </span>
                  </div>

                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Booking link
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700">
                      {bookingUrl}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-end gap-1">
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(bookingUrl, event.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                      {copiedEventId === event.id ? "✓ Copied!" : "Copy Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              +
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No events yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create your first event to start accepting bookings.
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create your first event
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
