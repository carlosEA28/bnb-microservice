import { Booking } from "../generated/prisma/client";

export function validateAvailability(
  existingBookings: Booking[],
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string,
): boolean {
  const newCheckIn = new Date(checkIn);
  const newCheckOut = new Date(checkOut);

  for (const booking of existingBookings) {
    // Skip the booking if it's the one we're excluding
    if (excludeBookingId && booking.id === excludeBookingId) {
      continue;
    }

    // Skip cancelled bookings
    if (booking.status === "CANCELLED") {
      continue;
    }

    const existingCheckIn = new Date(booking.checkIn);
    const existingCheckOut = new Date(booking.checkOut);

    const hasOverlap =
      newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;

    if (hasOverlap) {
      return false;
    }
  }

  return true;
}

export function validateBookingDates(checkIn: Date, checkOut: Date): boolean {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    throw new Error("Check-in date cannot be in the past");
  }

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in date");
  }

  return true;
}

export function getOverlappingBookings(
  existingBookings: Booking[],
  checkIn: Date,
  checkOut: Date,
): Booking[] {
  const newCheckIn = new Date(checkIn);
  const newCheckOut = new Date(checkOut);

  return existingBookings.filter((booking) => {
    if (booking.status === "CANCELLED") {
      return false;
    }

    const existingCheckIn = new Date(booking.checkIn);
    const existingCheckOut = new Date(booking.checkOut);

    return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
  });
}
