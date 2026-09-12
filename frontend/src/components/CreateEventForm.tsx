import React, { useState } from "react";
import eventSchema from "../schemas/event.schema";
import { createEvent } from "../services/event.service";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

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
     await createEvent(validation.data);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.msg || "Failed to create event");
      } else {
        setApiError("Failed to create event");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
      />
      {errors.title && <p>{errors.title}</p>}
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Event description"
      />
      {errors.description && <p>{errors.description}</p>}
      <input
        value={duration}
        type="number"
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration in minutes"
      />
      {errors.duration && <p>{errors.duration}</p>}

      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="URL slug"
      />
      {errors.slug && <p>{errors.slug}</p>}

      <button type="submit">Create Event</button>
      {apiError && <p>{apiError}</p>}
    </form>
  );
}
