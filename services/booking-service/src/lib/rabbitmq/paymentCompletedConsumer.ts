import { BookingRepository } from "../../repositories/booking-repository";
import { getRabbitMQChannel } from "./connection";
import { PaymentCompletedEventDto } from "./events/PaymentCompletedEvent";

export class PaymentCompletedConsumer {
  constructor(private bookingRepository: BookingRepository) {}

  async start(): Promise<void> {
    const channel = await getRabbitMQChannel();
    const queue = "payment.completed";

    await channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;

        try {
          const event: PaymentCompletedEventDto = JSON.parse(
            msg.content.toString(),
          );

          await this.bookingRepository.confirmBooking(event.bookingId);

          channel.ack(msg);
        } catch (error: unknown) {
          const prismaError = error as { code?: string };
          if (prismaError.code === "P2025") {
            channel.ack(msg);
          } else {
            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false },
    );
  }
}
