import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventRouter from "./routes/event.routes.js";
import availabilityRouter from "./routes/availability.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/booking", bookingRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Mini Calendly API is running",
  });
});

export default app;
