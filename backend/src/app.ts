import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventRouter from "./routes/event.routes.js";
import availabilityRouter from "./routes/availability.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRouter);
app.use("/api/availability", availabilityRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Mini Calendly API is running",
  });
});

export default app;
