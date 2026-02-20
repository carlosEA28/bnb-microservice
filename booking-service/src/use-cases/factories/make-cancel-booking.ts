import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { CancelBookingUseCase } from "../cancelBooking";

export function makeCancelBookingUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const cancelBookingUseCase = new CancelBookingUseCase(
    prismaBookingRepository,
  );

  return cancelBookingUseCase;
}
