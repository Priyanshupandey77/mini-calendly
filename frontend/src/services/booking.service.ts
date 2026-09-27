import api from "./api";

export async function createBooking(data: {
  eventId: number;
  date: string;
  startTime: string;
  guestName: string;
  guestEmail: string;
}) {
  const response = await api.post("/booking", data);

  return response.data;
}

export async function cancelBookingByGuest(
  bookingId: number,
  guestEmail: string,
) {
  const response = await api.post(`/booking/${bookingId}/cancel`, {
    guestEmail,
  });

  return response.data;
}
