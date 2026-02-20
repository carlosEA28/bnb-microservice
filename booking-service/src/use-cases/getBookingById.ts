import { BookingRepository } from "../repositories/booking-repository";
import { BookingNotFoundError } from "./errors";

export class GetBookingByIdUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    return booking;
  }
}
