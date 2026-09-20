import { useEffect, useState } from "react";
import { getHostBookings } from "../services/host.service";
import type { Booking } from "../types/api.types";

export default function HostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
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
  return (
    <div>
      <h1>My Bookings</h1>
      {loading
        ? "Loading bookings..."
        : error
          ? error
          : bookings.length === 0
            ? "No bookings yet."
            : bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <h2>{booking.event.title}</h2>

                  <p>Guest: {booking.guestName}</p>
                  <p>Email: {booking.guestEmail}</p>

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
