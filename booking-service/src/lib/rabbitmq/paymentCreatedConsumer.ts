import { BookingRepository } from "../../repositories/booking-repository";
import { getRabbitMQChannel } from "./connection";
import { PaymentCreatedEventDto } from "./events/PaymentCompleted";

export class PaymentCreatedConsumer {
  constructor(private bookingRepository: BookingRepository) {}

  async start(): Promise<void> {
    const channel = await getRabbitMQChannel();
    const queue = "payment.created";

    await channel.assertQueue(queue, { durable: true });

    console.log(` Waiting for messages in ${queue}`);

    channel.consume(
      queue,
      async (msg) => {
        if (!msg) return;

        try {
          const event: PaymentCreatedEventDto = JSON.parse(
            msg.content.toString(),
          );

          console.log(
            ` Received payment.created for booking ${event.bookingId}`,
          );

          await this.bookingRepository.updatePaymentUrl(
            event.bookingId,
            event.paymentUrl,
          );

          console.log(` Updated booking ${event.bookingId} with payment URL`);

          channel.ack(msg);
        } catch (error: unknown) {
          console.error("Error processing payment.created:", error);

          // Se o booking não existe (P2025), descarta a mensagem
          const prismaError = error as { code?: string };
          if (prismaError.code === "P2025") {
            console.warn(`[!] Booking not found, discarding message`);
            channel.ack(msg); // Remove da fila, não faz sentido reprocessar
          } else {
            channel.nack(msg, false, true); // Requeue para outros erros
          }
        }
      },
      { noAck: false },
    );
  }
}
