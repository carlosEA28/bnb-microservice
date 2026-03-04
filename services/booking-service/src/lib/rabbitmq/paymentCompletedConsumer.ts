import { BookingRepository } from "../../repositories/booking-repository";
import { getRabbitMQChannel } from "./connection";
import { PaymentCompletedEventDto } from "./events/PaymentCompletedEvent";

export class PaymentCompletedConsumer {
  constructor(private bookingRepository: BookingRepository) {}

  async start(): Promise<void> {
    const channel = await getRabbitMQChannel();
    const queue = "payment.completed";

    await channel.assertQueue(queue, { durable: true });

    console.log(` Waiting for messages in ${queue}`);

    channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;

        try {
          const event: PaymentCompletedEventDto = JSON.parse(
            msg.content.toString(),
          );

          console.log(
            ` Received payment.completed for booking ${event.bookingId}`,
          );

          await this.bookingRepository.confirmBooking(event.bookingId);
          console.log(` Booking ${event.bookingId} confirmed`);

          channel.ack(msg);
        } catch (error: unknown) {
          console.error("Error processing payment.completed:", error);

          const prismaError = error as { code?: string };
          if (prismaError.code === "P2025") {
            console.warn(`[!] Booking not found, discarding message`);
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
