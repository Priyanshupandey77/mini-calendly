import type {
  CreateEventData,
  CreateEventResponse,
  DeleteEventResponse,
  Event,
} from "../types/api.types";
import api from "./api";

export async function getEvents() {
  const response = await api.get<Event[]>("/events");

  return response.data;
}

export async function createEvent(data: CreateEventData) {
  const response = await api.post<CreateEventResponse>("/events", data);

  return response.data;
}

export async function deleteEvent(eventId: number) {
  const response = await api.delete<DeleteEventResponse>(
    `/events/${eventId}`,
  );

  return response.data;
}