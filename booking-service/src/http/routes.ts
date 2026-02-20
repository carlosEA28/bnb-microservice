import { Router } from "express";
import { createBooking } from "./controller/createBooking";
import { cancelBooking } from "./controller/cancelBooking";
import { confirmBooking } from "./controller/confirmBooking";
import { getBookingById } from "./controller/getBookingById";
import { getBookingsByGuest } from "./controller/getBookingsByGuest";
import { getBookingsByProperty } from "./controller/getBookingsByProperty";
import { getAllBookings } from "./controller/getAllBookings";

export const Approutes = Router();

Approutes.get("/bookings/health", (req, res) => {
  res.json({ status: "ok", service: "booking-service" });
});

// Booking routes
Approutes.post("/bookings", createBooking);
Approutes.get("/bookings", getAllBookings);
Approutes.get("/bookings/:id", getBookingById);
Approutes.get("/bookings/guest/:guestId", getBookingsByGuest);
Approutes.get("/bookings/property/:propertyId", getBookingsByProperty);
Approutes.patch("/bookings/:id/cancel", cancelBooking);
Approutes.patch("/bookings/:id/confirm", confirmBooking);
