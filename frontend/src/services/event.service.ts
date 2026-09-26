import type {
  CreateEventData,
  CreateEventResponse,
  DeleteEventResponse,
  Event,
  UpdateEventData,
  UpdateEventResponse,
} from "../types/api.types";
import api from "./api";

export async function getEvents() {
  const response = await api.get<Event[]>("/events");

  return response.data;
}
export async function getPublicEvent(slug: string) {
  const response = await api.get(`/events/public/${slug}`);

  return response.data;
}
export async function getAvailableSlots(slug: string, date: string) {
  const response = await api.get(
    `/events/public/${slug}/availability?date=${date}`,
  );

  return response.data;
}

export async function createEvent(data: CreateEventData) {
  const response = await api.post<CreateEventResponse>("/events", data);

  return response.data;
}

export async function updateEvent(eventId: number, data: UpdateEventData) {
  const response = await api.patch<UpdateEventResponse>(
    `/events/${eventId}`,
    data,
  );

  return response.data;
}

export async function deleteEvent(eventId: number) {
  const response = await api.delete<DeleteEventResponse>(`/events/${eventId}`);

  return response.data;
}
