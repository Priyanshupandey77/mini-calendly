import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Event } from "../types/api.types";
import { getAvailableSlots, getPublicEvent } from "../services/event.service";
import { createBooking } from "../services/booking.service";

export default function PublicBookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [error, setError] = useState("");

  async function handleBooking() {
    if (!slug) return;
    if (!event || !selectedDate || !selectedTime) return;
    if (!guestName.trim() || !guestEmail.trim()) {
      return;
    }

    setBookingLoading(true);
    setBookingSuccess("");
    setBookingError("");

    try {
      const data = {
        eventId: event.id,
        date: selectedDate,
        startTime: selectedTime,
        guestName,
        guestEmail,
      };
      await createBooking(data);
      const updatedSlots = await getAvailableSlots(slug, selectedDate);
      setSlots(updatedSlots.slots);
      setSelectedTime("");
      setBookingSuccess("Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      setBookingError("Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    async function fetchEvent() {
      if (!slug) return;
      try {
        const data = await getPublicEvent(slug);
        setEvent(data.event);
      } catch (error) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);
  useEffect(() => {
    async function fetchSlots() {
      if (!slug || !selectedDate) return;

      setSlotsLoading(true);

      try {
        const data = await getAvailableSlots(slug, selectedDate);
        setSlots(data.slots);
      } finally {
        setSlotsLoading(false);
      }
    }

    fetchSlots();
  }, [slug, selectedDate]);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{event?.title}</h1>
      <p>{event?.description}</p>
      <p>{event?.duration} minutes</p>
      <label>
        Select a date:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
            setSlots([]);
          }}
        />
      </label>
      <div>
        {slotsLoading && <p>Loading available times...</p>}
        {slots.map((slot) => (
          <button key={slot} onClick={() => setSelectedTime(slot)}>
            {slot}
          </button>
        ))}
        {selectedTime && <p>Selected time: {selectedTime}</p>}
        {selectedTime && (
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Your email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={handleBooking}
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Book Appointment"}
            </button>

            {bookingError && <p>{bookingError}</p>}
          </div>
        )}
        {bookingSuccess && <p>{bookingSuccess}</p>}
      </div>
    </div>
  );
}
