import { BookingRepository } from "../repositories/booking-repository";
import { NoBookingsFoundForPropertyError } from "./errors";

export class GetBookingsByPropertyUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(propertyId: string) {
    const bookings =
      await this.bookingRepository.getBookingsByProperty(propertyId);

    if (bookings.length === 0) {
      throw new NoBookingsFoundForPropertyError(propertyId);
    }

    return bookings;
  }
}
