import { BookingRepository } from "../repositories/booking-repository";
import { BookingNotFoundError, BookingAlreadyCancelledError } from "./errors";

export class CancelBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    if (booking.status === "CANCELLED") {
      throw new BookingAlreadyCancelledError(bookingId);
    }

    const cancelledBooking =
      await this.bookingRepository.cancelBooking(bookingId);

    return cancelledBooking;
  }
}
