import { BookingRepository } from "../repositories/booking-repository";

export class GetAllBookingsUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute() {
    const bookings = await this.bookingRepository.getAllBookings();

    if (bookings.length === 0) {
      throw new Error("No bookings were found");
    }

    return bookings;
  }
}
