export class BookingAlreadyConfirmedError extends Error {
  constructor(bookingId: string) {
    super(`Booking ${bookingId} is already confirmed`);
    this.name = "BookingAlreadyConfirmedError";
  }
}
