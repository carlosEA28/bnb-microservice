export class NoBookingsFoundForGuestError extends Error {
  constructor(guestId: string) {
    super(`No bookings found for guest ${guestId}`);
    this.name = "NoBookingsFoundForGuestError";
  }
}
