import { BookingRepository } from "../repositories/booking-repository";
import { NoBookingsFoundError } from "./errors";

export class GetAllBookingsUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute() {
    const bookings = await this.bookingRepository.getAllBookings();

    if (bookings.length === 0) {
      throw new NoBookingsFoundError();
    }

    return bookings;
  }
}
