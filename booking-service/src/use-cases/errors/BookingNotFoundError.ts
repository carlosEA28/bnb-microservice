export class BookingNotFoundError extends Error {
  constructor(bookingId?: string) {
    super(
      bookingId
        ? `Booking with ID ${bookingId} not found`
        : "Booking not found",
    );
    this.name = "BookingNotFoundError";
  }
}
