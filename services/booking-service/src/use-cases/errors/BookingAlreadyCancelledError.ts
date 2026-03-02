export class BookingAlreadyCancelledError extends Error {
  constructor(bookingId: string) {
    super(`Booking ${bookingId} is already cancelled`);
    this.name = "BookingAlreadyCancelledError";
  }
}
