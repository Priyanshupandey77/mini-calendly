import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Booking, Event } from "../types/api.types";
import { deleteEvent, getEvents } from "../services/event.service";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getHostBookings } from "../services/host.service";

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<number, number>>(
    {},
  );
  const [copiedEventId, setCopiedEventId] = useState<number | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleDelete = async (eventId: number) => {
    try {
      setError("");
      setDeletingEventId(eventId);

      await deleteEvent(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setBookingCounts((prev) => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Failed to delete event");
      } else {
        setError("Failed to delete event");
      }
    } finally {
      setDeletingEventId(null);
    }
  };
  const confirmDelete = async () => {
    if (eventToDelete === null) return;

    const eventId = eventToDelete;

    setEventToDelete(null);

    await handleDelete(eventId);
  };

  const handleEdit = (eventId: number) => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleCopyLink = async (bookingUrl: string, eventId: number) => {
    await navigator.clipboard.writeText(bookingUrl);

    setCopiedEventId(eventId);

    setTimeout(() => {
      setCopiedEventId(null);
    }, 2000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError("");

        const [eventsData, bookingsData] = await Promise.all([
          getEvents(),
          getHostBookings(),
        ]);

        setEvents(eventsData);

        const counts: Record<number, number> = {};

        bookingsData.bookings.forEach((booking: Booking) => {
          counts[booking.eventId] = (counts[booking.eventId] || 0) + 1;
        });

        setBookingCounts(counts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.msg || "Failed to load dashboard data",
          );
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <p className="text-sm font-medium text-indigo-600">Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
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
            onClick={() => navigate("/dashboard/events")}
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
              const totalBookings = bookingCounts[event.id] || 0;
              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start gap-3 sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-900">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {event.description}
                      </p>
                    </div>

                    <span className="ml-auto shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {event.duration} min
                    </span>
                  </div>

                  {/* Booking count */}
                  <div className="mt-4 flex flex-col gap-3 rounded-lg bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Bookings
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {totalBookings}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/bookings")}
                      className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                      View Bookings →
                    </button>
                  </div>

                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Booking link
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {bookingUrl}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 sm:justify-end">
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(bookingUrl, event.id)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    >
                      {copiedEventId === event.id ? "✓ Copied!" : "Copy Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(event.id)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingEventId === event.id}
                      onClick={() => setEventToDelete(event.id)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      {deletingEventId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {eventToDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  !
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Delete Event?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEventToDelete(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
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
              onClick={() => navigate("/dashboard/events")}
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
