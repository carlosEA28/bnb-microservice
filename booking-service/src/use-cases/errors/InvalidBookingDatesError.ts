export class InvalidBookingDatesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookingDatesError";
  }
}
