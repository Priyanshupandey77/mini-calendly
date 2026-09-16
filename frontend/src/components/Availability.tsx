import { useEffect, useState } from "react";
import {
  createAvailability,
  deleteAvailability,
  getAvailability,
  updateAvailability,
} from "../services/availability.service";
type Day = {
  id: number | null;
  dayOfWeek: number;
  name: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

const days = [
  {
    id: null,
    dayOfWeek: 1,
    name: "Monday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 2,
    name: "Tuesday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 3,
    name: "Wednesday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 4,
    name: "Thursday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 5,
    name: "Friday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 6,
    name: "Saturday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: null,
    dayOfWeek: 7,
    name: "Sunday",
    enabled: true,
    startTime: "09:00",
    endTime: "17:00",
  },
];

export default function Availability() {
  const [availability, setAvailability] = useState<Day[]>(days);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const savedAvailability = await getAvailability();

        setAvailability((prev) =>
          prev.map((day) => {
            const savedDay = savedAvailability.find(
              (item) => item.dayOfWeek === day.dayOfWeek,
            );

            if (savedDay) {
              return {
                ...day,
                id: savedDay.id,
                enabled: true,
                startTime: savedDay.startTime,
                endTime: savedDay.endTime,
              };
            }

            return {
              ...day,
              enabled: false,
            };
          }),
        );
      } catch (error) {
        console.error("Failed to fetch availability", error);
      }
    };

    fetchAvailability();
  }, []);

  function handleStartTimeChange(dayOfWeek: number, newTime: string) {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          return {
            ...day,
            startTime: newTime,
          };
        }

        return day;
      }),
    );
  }
  function handleEndTimeChange(dayOfWeek: number, newTime: string) {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.dayOfWeek === dayOfWeek) {
          return {
            ...day,
            endTime: newTime,
          };
        }

        return day;
      }),
    );
  }
  async function handleToggleDay(dayOfWeek: number) {
    const day = availability.find((day) => day.dayOfWeek === dayOfWeek);
    if (!day || loading) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      let deleted = false;
      if (day.enabled === true && day.id !== null) {
        await deleteAvailability(day.id);
        deleted = true;
      }
      setAvailability((prev) =>
        prev.map((day) => {
          if (day.dayOfWeek === dayOfWeek) {
            return {
              ...day,
              enabled: !day.enabled,
              id: day.enabled ? null : day.id,
            };
          }
          return day;
        }),
      );
      if (deleted) {
        setSuccess("Availability deleted successfully");
      } else {
        setSuccess("Day enabled successfully");
      }
    } catch (error) {
      setError("Failed to update availability");
      console.error("Failed to toggle availability:", error);
    } finally {
      setLoading(false);
    }
  }
  async function handleSaveAvailability(day: Day) {
    if (!day.enabled) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = {
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
      };
      if (day.id === null) {
        const response = await createAvailability(data);
        setAvailability((prev) =>
          prev.map((currentDay) => {
            if (currentDay.dayOfWeek === day.dayOfWeek) {
              return {
                ...currentDay,
                id: response.availability.id,
              };
            }
            return currentDay;
          }),
        );
      } else {
        await updateAvailability(day.id, data);
      }
      setSuccess("Availability saved successfully");
    } catch (error) {
      setError("Failed to save availability");
      console.error("Failed to save availability:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Availability</h2>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      {availability.map((day) => (
        <div key={day.dayOfWeek}>
          <p>{day.name}</p>
          <input
            type="time"
            onChange={(e) =>
              handleStartTimeChange(day.dayOfWeek, e.target.value)
            }
            value={day.startTime}
            disabled={!day.enabled}
          />
          <input
            type="time"
            onChange={(e) => handleEndTimeChange(day.dayOfWeek, e.target.value)}
            value={day.endTime}
            disabled={!day.enabled}
          />
          <input
            type="checkbox"
            checked={day.enabled}
            disabled={loading}
            onChange={() => handleToggleDay(day.dayOfWeek)}
          />
          <button
            disabled={!day.enabled || loading}
            onClick={() => handleSaveAvailability(day)}
          >
            {loading ? "saving..." : "save"}
          </button>
        </div>
      ))}
    </div>
  );
}
