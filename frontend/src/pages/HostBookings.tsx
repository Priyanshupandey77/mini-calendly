import { useEffect, useState } from "react";
import { getHostBookings } from "../services/host.service";
import type { Booking } from "../types/api.types";

export default function HostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "CANCELLED">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const data = await getHostBookings();
        setBookings(data.bookings);
      } catch (error) {
        console.error(error);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchHostData();
  }, []);
  const totalBookings = bookings.length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED",
  ).length;

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDateTime = new Date(
      `${booking.date.split("T")[0]}T${booking.startTime}`,
    );

    const now = new Date();

    return (
      bookingDateTime.getTime() > now.getTime() &&
      booking.status === "CONFIRMED"
    );
  }).length;

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") {
      return true;
    }

    if (filter === "CANCELLED") {
      return booking.status === "CANCELLED";
    }

    if (filter === "UPCOMING") {
      const bookingDateTime = new Date(
        `${booking.date.split("T")[0]}T${booking.startTime}`,
      );

      const now = new Date();

      return (
        bookingDateTime.getTime() > now.getTime() &&
        booking.status === "CONFIRMED"
      );
    }
  });
  const emptyMessage =
    filter === "ALL"
      ? "No bookings yet."
      : filter === "UPCOMING"
        ? "No upcoming bookings."
        : "No cancelled bookings.";
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-indigo-600">Bookings</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage the appointments people have booked with you.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "ALL"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          All
          <span className="ml-1.5 text-xs">({totalBookings})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("UPCOMING")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "UPCOMING"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Upcoming
          <span className="ml-1.5 text-xs">({upcomingBookings})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter("CANCELLED")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "CANCELLED"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          Cancelled
          <span className="ml-1.5 text-xs">({cancelledBookings})</span>
        </button>
      </div>
      {/* Booking Results */}
      <div>
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              📅
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {emptyMessage}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Bookings matching this filter will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                {/* Top section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {booking.event.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Booking #{booking.id}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Booking details */}
                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Guest
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {booking.guestName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.guestEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Date & time
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {new Date(booking.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {booking.startTime} – {booking.endTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
