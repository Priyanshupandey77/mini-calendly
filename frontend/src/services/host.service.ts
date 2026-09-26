import type { GetHostBookingsResponse } from "../types/api.types";
import api from "./api";

export async function getHostBookings() {
  const response = await api.get<GetHostBookingsResponse>("/host");

  return response.data;
}

export async function cancelBooking(bookingId: number) {
  const response = await api.delete(`/booking/${bookingId}`);

  return response.data;
}