export class NoBookingsFoundError extends Error {
  constructor() {
    super("No bookings were found");
    this.name = "NoBookingsFoundError";
  }
}
