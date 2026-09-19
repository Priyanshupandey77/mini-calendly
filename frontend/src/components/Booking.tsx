import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Event } from "../types/api.types";
import { getAvailableSlots, getPublicEvent } from "../services/event.service";
import { createBooking } from "../services/booking.service";

type ConfirmedBooking = {
  event: Event;
  date: string;
  time: string;
  guestName: string;
  guestEmail: string;
};

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
  const [formError, setFormError] = useState("");
  const [confirmedBooking, setConfirmedBooking] =
    useState<ConfirmedBooking | null>(null);

  const today = new Date().toISOString().split("T")[0];

  async function handleBooking() {
    if (!slug) return;
    if (!event || !selectedDate || !selectedTime) return;
    if (!guestName.trim()) {
      setFormError("Please enter your name");
      return;
    }

    if (!guestEmail.trim()) {
      setFormError("Please enter your email");
      return;
    }

    if (!guestEmail.includes("@")) {
      setFormError("Please enter a valid email");
      return;
    }

    setBookingLoading(true);
    setBookingSuccess("");
    setBookingError("");
    setFormError("");

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
      setBookingSuccess("Appointment booked successfully!");
      setConfirmedBooking({
        event,
        date: selectedDate,
        time: selectedTime,
        guestName,
        guestEmail,
      });
      setSelectedTime("");
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
          min={today}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
            setSlots([]);
          }}
        />
      </label>
      <div>
        {slotsLoading ? (
          <p>Loading available slots...</p>
        ) : !selectedDate ? (
          <p>Please select a date</p>
        ) : slots.length > 0 ? (
          slots.map((slot) => (
            <button
              className={selectedTime === slot ? "selected-time" : ""}
              key={slot}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))
        ) : (
          <p>Booking is not available for this date</p>
        )}

        {selectedTime && <p>Selected time: {selectedTime}</p>}
        {selectedTime && (
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setFormError("");
              }}
            />

            <input
              type="email"
              placeholder="Your email"
              value={guestEmail}
              onChange={(e) => {
                setGuestEmail(e.target.value);
                setFormError("");
              }}
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
        {confirmedBooking && (
          <div>
            {confirmedBooking.event.title},
            {confirmedBooking.date},
            {confirmedBooking.time},
            {confirmedBooking.event.duration},
            {confirmedBooking.guestName},
            {confirmedBooking.guestEmail},
          </div>
        )}
        {formError && <p>{formError}</p>}
      </div>
    </div>
  );
}
