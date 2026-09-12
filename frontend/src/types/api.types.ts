export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
  createdAt: string;
  userId: number;
}

export interface Availability {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  userId: number;
}

export interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  userId: number;
  eventId: number;
}
export interface CreateEventData {
  title: string;
  description?: string;
  duration: number;
  slug: string;
}

export interface CreateEventResponse {
  msg: string;
  event: Event;
}
export interface DeleteEventResponse {
  msg: string;
}