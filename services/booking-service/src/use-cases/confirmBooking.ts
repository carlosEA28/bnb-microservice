import { BookingRepository } from "../repositories/booking-repository";
import {
  BookingAlreadyConfirmedError,
  BookingNotFoundError,
  CannotConfirmCancelledBookingError,
} from "./errors";

export class ConfirmBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    if (booking.status === "CANCELLED") {
      throw new CannotConfirmCancelledBookingError(bookingId);
    }

    if (booking.status === "CONFIRMED") {
      throw new BookingAlreadyConfirmedError(bookingId);
    }

    const confirmedBooking =
      await this.bookingRepository.confirmBooking(bookingId);

    return confirmedBooking;
  }
}
