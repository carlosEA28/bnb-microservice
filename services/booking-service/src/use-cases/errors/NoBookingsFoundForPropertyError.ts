export class NoBookingsFoundForPropertyError extends Error {
  constructor(propertyId: string) {
    super(`No bookings found for property ${propertyId}`);
    this.name = "NoBookingsFoundForPropertyError";
  }
}
