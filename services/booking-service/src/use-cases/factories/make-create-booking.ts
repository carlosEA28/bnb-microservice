import { PrismaBookingRepository } from "../../repositories/prisma/prisma-booking-repository";
import { CreateBookingUseCase } from "../createBooking";
import { getRabbitMQChannel } from "../../lib/rabbitmq/connection";
import { RabbitmqClient } from "../../lib/rabbitmq/rabbitmqClient";

export async function makeCreateBookingUseCase() {
  const prismaBookingRepository = new PrismaBookingRepository();
  const channel = await getRabbitMQChannel();
  const eventPublisher = new RabbitmqClient(channel);
  const createBookingUseCase = new CreateBookingUseCase(
    prismaBookingRepository,
    eventPublisher,
  );

  return createBookingUseCase;
}
