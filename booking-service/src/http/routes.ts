import { Router } from "express";

export const Approutes = Router();

Approutes.get("/bookings/health", (req, res) => {
  res.json({ status: "ok", service: "booking-service" });
});
