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
