import React, { useEffect, useState } from "react";
import eventSchema from "../schemas/event.schema";
import { createEvent, getEvents, updateEvent } from "../services/event.service";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EventForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditMode || !id) return;

    const fetchEvent = async () => {
      try {
        const events = await getEvents();

        const event = events.find((event) => event.id === Number(id));

        if (!event) {
          setApiError("Event not found");
          return;
        }

        setTitle(event.title);
        setDescription(event.description ?? "");
        setDuration(String(event.duration));
        setSlug(event.slug);
      } catch (error) {
        setApiError("Failed to load event");
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const validation = eventSchema.safeParse({
      title,
      description,
      duration: Number(duration),
      slug,
    });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string") {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      setIsSubmitting(true);

      if (isEditMode && id) {
        await updateEvent(Number(id), validation.data);
      } else {
        await createEvent(validation.data);
      }
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.msg ||
            (isEditMode ? "Failed to update event" : "Failed to create event"),
        );
      } else {
        setApiError(
          isEditMode ? "Failed to update event" : "Failed to create event",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormIncomplete =
    !title.trim() || !description.trim() || !duration.trim() || !slug.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Event title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 30-minute consultation"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this meeting is about"
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Duration
          </label>

          <div className="relative">
            <input
              value={duration}
              type="number"
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              min="1"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              minutes
            </span>
          </div>

          {errors.duration && (
            <p className="mt-1.5 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            URL slug
          </label>

          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <span className="border-r border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
              /
            </span>

            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="consultation"
              className="min-w-0 flex-1 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          {errors.slug && (
            <p className="mt-1.5 text-sm text-red-600">{errors.slug}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isFormIncomplete || isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
            ? "Update Event"
            : "Create Event"}
      </button>
      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}
    </form>
  );
}
