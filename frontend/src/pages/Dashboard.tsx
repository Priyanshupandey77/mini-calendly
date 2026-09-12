import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Event } from "../types/api.types";
import { deleteEvent, getEvents } from "../services/event.service";
import axios from "axios";

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Failed to delete event");
      } else {
        setError("Failed to delete event");
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setIsLoading(false);
      } catch (error) {
        setError("something went wrong..");
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h3>welcome back, {user?.name} 👋</h3>
      <p>Manage your events and availability from here.</p>
      {error ? (
        <p>{error}</p>
      ) : isLoading ? (
        "Loading events..."
      ) : events.length > 0 ? (
        events.map((event) => (
          <div key={event.id}>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <p>{event.duration} minutes</p>
            <p>/{event.slug}</p>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>
          <b>No events yet. Create your first event.</b>
        </p>
      )}
      <button>Create Event</button>
      <button>Manage Availability </button>
    </div>
  );
}

export default Dashboard;
