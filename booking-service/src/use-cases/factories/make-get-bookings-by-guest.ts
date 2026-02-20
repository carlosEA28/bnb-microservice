import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { GetBookingsByGuestUseCase } from "../getBookingsByGuest";

export function makeGetBookingsByGuestUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const getBookingsByGuestUseCase = new GetBookingsByGuestUseCase(
    prismaBookingRepository,
  );

  return getBookingsByGuestUseCase;
}
