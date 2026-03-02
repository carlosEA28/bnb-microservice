import { BookingRepository } from "../repositories/booking-repository";

export class GetBookingsByGuestUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(guestId: string) {
    const bookings = await this.bookingRepository.getBookingsByGuest(guestId);

    if (bookings.length === 0) {
      throw new Error("No bookings found for this guest");
    }

    return bookings;
  }
}
