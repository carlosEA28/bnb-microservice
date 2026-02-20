import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { ConfirmBookingUseCase } from "../confirmBooking";

export function makeConfirmBookingUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const confirmBookingUseCase = new ConfirmBookingUseCase(
    prismaBookingRepository,
  );

  return confirmBookingUseCase;
}
