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
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-sm font-medium text-indigo-600">Settings</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Availability
        </h1>

        <p className="mt-2 text-slate-500">
          Set the hours when people can book appointments with you.
        </p>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* Availability list */}
      <div className="space-y-4">
        {availability.map((day) => (
          <div
            key={day.dayOfWeek}
            className={`rounded-xl border bg-white p-5 shadow-sm transition ${
              day.enabled
                ? "border-slate-200"
                : "border-slate-200 bg-slate-50/70"
            }`}
          >
            {/* Day header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {day.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {day.enabled
                    ? "Available for bookings"
                    : "Not available for bookings"}
                </p>
              </div>

              {/* Toggle */}
              <label className="flex cursor-pointer items-center gap-3">
                <span className="text-sm font-medium text-slate-600">
                  {day.enabled ? "Enabled" : "Disabled"}
                </span>

                <input
                  type="checkbox"
                  checked={day.enabled}
                  disabled={loading}
                  onChange={() => handleToggleDay(day.dayOfWeek)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                />
              </label>
            </div>

            {/* Time controls */}
            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Start time
                </label>

                <input
                  type="time"
                  value={day.startTime}
                  disabled={!day.enabled}
                  onChange={(e) =>
                    handleStartTimeChange(day.dayOfWeek, e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  End time
                </label>

                <input
                  type="time"
                  value={day.endTime}
                  disabled={!day.enabled}
                  onChange={(e) =>
                    handleEndTimeChange(day.dayOfWeek, e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <button
                type="button"
                disabled={!day.enabled || loading}
                onClick={() => handleSaveAvailability(day)}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
