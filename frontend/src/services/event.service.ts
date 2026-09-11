import type { Event } from "../types/api.types";
import api from "./api";

export async function getEvents() {
  const response = await api.get<Event[]>("/events");
  return response.data;
}

