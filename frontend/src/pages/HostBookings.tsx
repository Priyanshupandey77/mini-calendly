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
    <div>
      <h1>My Bookings</h1>
      <div>
        <button onClick={() => setFilter("ALL")}>All - {totalBookings}</button>

        <button onClick={() => setFilter("UPCOMING")}>
          Upcoming - {upcomingBookings}
        </button>

        <button onClick={() => setFilter("CANCELLED")}>
          Cancelled - {cancelledBookings}
        </button>
      </div>
      {loading
        ? "Loading bookings..."
        : error
          ? error
          : filteredBookings.length === 0
            ? emptyMessage
            : filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <h2>{booking.event.title}</h2>

                  <p>Guest: {booking.guestName}</p>
                  <p>Email: {booking.guestEmail}</p>
                  <p>Status: {booking.status}</p>

                  <p>
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p>
                    Time: {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              ))}
    </div>
  );
}
