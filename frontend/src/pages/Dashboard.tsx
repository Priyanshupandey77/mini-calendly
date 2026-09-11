import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Event } from "../types/api.types";
import { getEvents } from "../services/event.service";

function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        // show events
        events.map((event) => (
          <div key={event.id}>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <p>{event.duration} minutes</p>
            <p>/{event.slug}</p>
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
