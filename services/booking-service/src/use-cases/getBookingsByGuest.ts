import { BookingRepository } from "../repositories/booking-repository";
import { NoBookingsFoundForGuestError } from "./errors";

export class GetBookingsByGuestUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(guestId: string) {
    const bookings = await this.bookingRepository.getBookingsByGuest(guestId);

    if (bookings.length === 0) {
      throw new NoBookingsFoundForGuestError(guestId);
    }

    return bookings;
  }
}
