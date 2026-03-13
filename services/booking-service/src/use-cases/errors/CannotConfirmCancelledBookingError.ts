export class CannotConfirmCancelledBookingError extends Error {
  constructor(bookingId: string) {
    super(`Cannot confirm cancelled booking ${bookingId}`);
    this.name = "CannotConfirmCancelledBookingError";
  }
}
