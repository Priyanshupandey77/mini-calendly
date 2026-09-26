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
  const [availabilityError, setAvailabilityError] = useState("");
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
      setAvailabilityError("");

      try {
        const data = await getAvailableSlots(slug, selectedDate);
        setSlots(data.slots);
      } catch {
        setAvailabilityError("Failed to load available slots");
      } finally {
        setSlotsLoading(false);
      }
    }

    fetchSlots();
  }, [slug, selectedDate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            M
          </div>

          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Mini Calendly
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Event Information */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-medium text-indigo-600">Meeting</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {event?.title}
            </h1>

            <p className="mt-4 leading-7 text-slate-500">
              {event?.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                ⏱
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {event?.duration} minutes
                </p>

                <p className="text-xs text-slate-500">Meeting duration</p>
              </div>
            </div>
          </section>

          {/* Booking Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Date */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Select a date
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a date to see available times.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime("");
                    setSlots([]);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Available Slots */}
            <div className="mt-8 border-t border-slate-100 pt-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Available times
              </h2>

              {slotsLoading ? (
                <div className="mt-4 rounded-lg bg-slate-50 px-4 py-4 text-center">
                  <p className="text-sm text-slate-500">
                    Loading available slots...
                  </p>
                </div>
              ) : availabilityError ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {availabilityError}
                  </p>
                </div>
              ) : !selectedDate ? (
                <div className="mt-4 rounded-lg bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    Please select a date to view available times.
                  </p>
                </div>
              ) : slots.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setFormError("");
                        setBookingError("");
                      }}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                        selectedTime === slot
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    Booking is not available for this date.
                  </p>
                </div>
              )}
            </div>

            {/* Selected Time + Guest Form */}
            {selectedTime && (
              <div className="mt-8 border-t border-slate-100 pt-8">
                <div className="rounded-lg bg-indigo-50 px-4 py-3">
                  <p className="text-sm font-medium text-indigo-700">
                    Selected time: {selectedTime}
                  </p>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Your name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={guestName}
                      onChange={(e) => {
                        setGuestName(e.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={guestEmail}
                      onChange={(e) => {
                        setGuestEmail(e.target.value);
                        setFormError("");
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {formError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {formError}
                      </p>
                    </div>
                  )}

                  {bookingError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {bookingError}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bookingLoading ? "Booking..." : "Book Appointment"}
                  </button>
                </div>
              </div>
            )}

            {/* Booking Success */}
            {bookingSuccess && (
              <div className="mt-8 border-t border-slate-100 pt-8">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      ✓
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-emerald-800">
                        Booking confirmed
                      </h2>

                      <p className="mt-1 text-sm text-emerald-700">
                        {bookingSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmed Booking Details */}
            {confirmedBooking && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Appointment details
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Event</span>
                    <span className="text-right font-medium text-slate-900">
                      {confirmedBooking.event.title}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Date</span>
                    <span className="text-right font-medium text-slate-900">
                      {new Date(confirmedBooking.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Time</span>
                    <span className="text-right font-medium text-slate-900">
                      {confirmedBooking.time}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Duration</span>
                    <span className="text-right font-medium text-slate-900">
                      {confirmedBooking.event.duration} minutes
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Guest</span>
                    <span className="text-right font-medium text-slate-900">
                      {confirmedBooking.guestName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Email</span>
                    <span className="max-w-[60%] break-all text-right font-medium text-slate-900">
                      {confirmedBooking.guestEmail}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Powered by Mini Calendly
        </p>
      </div>
    </div>
  );
}
