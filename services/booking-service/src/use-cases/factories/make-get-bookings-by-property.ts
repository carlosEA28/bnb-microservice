import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { GetBookingsByPropertyUseCase } from "../getBookingsByProperty";

export function makeGetBookingsByPropertyUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const getBookingsByPropertyUseCase = new GetBookingsByPropertyUseCase(
    prismaBookingRepository,
  );

  return getBookingsByPropertyUseCase;
}
