import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { GetAllBookingsUseCase } from "../getAllBookings";

export function makeGetAllBookingsUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const getAllBookingsUseCase = new GetAllBookingsUseCase(
    prismaBookingRepository,
  );

  return getAllBookingsUseCase;
}
