import { BookingRepository } from "../repositories/booking-repository";
import { CreateBookingParamsSchema } from "../dtos/createBookingDto";
import {
  calculateTotalPrice,
  validateAvailability,
  validateBookingDates,
} from "../helpers";
import { PropertyNotAvailableError, InvalidBookingDatesError } from "./errors";

export class CreateBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(params: unknown) {
    const validatedParams = CreateBookingParamsSchema.parse(params);

    const { propertyId, guestId, checkIn, checkOut, pricePerNight } =
      validatedParams;

    // valida as datas
    try {
      validateBookingDates(checkIn, checkOut);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidBookingDatesError(error.message);
      }
      throw error;
    }

    // ve se esta disponivel
    const existingBookings =
      await this.bookingRepository.getActiveBookingsByProperty(propertyId);
    const isAvailable = validateAvailability(
      existingBookings,
      checkIn,
      checkOut,
    );

    if (!isAvailable) {
      throw new PropertyNotAvailableError(propertyId, checkIn, checkOut);
    }

    // Calcula o preco
    const totalPrice = calculateTotalPrice(checkIn, checkOut, pricePerNight);

    const booking = await this.bookingRepository.createBooking({
      propertyId,
      guestId,
      checkIn,
      checkOut,
      totalPrice,
    });

    return booking;
  }
}
