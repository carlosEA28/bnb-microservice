import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { CreateBookingUseCase } from "../createBooking";

export function makeCreateBookingUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const createBookingUseCase = new CreateBookingUseCase(
    prismaBookingRepository,
  );

  return createBookingUseCase;
}
