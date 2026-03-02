import { BookingRepository } from "../repositories/booking-repository";
import { BookingNotFoundError } from "./errors";

export class ConfirmBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Cannot confirm a cancelled booking");
    }

    if (booking.status === "CONFIRMED") {
      throw new Error("Booking is already confirmed");
    }

    const confirmedBooking =
      await this.bookingRepository.confirmBooking(bookingId);

    return confirmedBooking;
  }
}
