import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { GetBookingByIdUseCase } from "../getBookingById";

export function makeGetBookingByIdUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const getBookingByIdUseCase = new GetBookingByIdUseCase(
    prismaBookingRepository,
  );

  return getBookingByIdUseCase;
}
