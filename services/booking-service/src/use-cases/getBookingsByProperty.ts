import { BookingRepository } from "../repositories/booking-repository";

export class GetBookingsByPropertyUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(propertyId: string) {
    const bookings =
      await this.bookingRepository.getBookingsByProperty(propertyId);

    if (bookings.length === 0) {
      throw new Error("No bookings found for this property");
    }

    return bookings;
  }
}
