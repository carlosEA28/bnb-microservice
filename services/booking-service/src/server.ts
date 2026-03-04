import { app } from "./app";
import { env } from "./env/env";
import { PaymentCreatedConsumer } from "./lib/rabbitmq/paymentCreatedConsumer";
import { PaymentCompletedConsumer } from "./lib/rabbitmq/paymentCompletedConsumer";
import { PrismaBookingRepository } from "./repositories/prisma/prisma-booking-repository";

async function bootstrap() {
  const bookingRepository = new PrismaBookingRepository();

  // Inicia o consumer de payment.created
  const paymentCreatedConsumer = new PaymentCreatedConsumer(bookingRepository);
  await paymentCreatedConsumer.start();
  console.log("PaymentCreated consumer started");

  // Inicia o consumer de payment.completed
  const paymentCompletedConsumer = new PaymentCompletedConsumer(
    bookingRepository,
  );
  await paymentCompletedConsumer.start();
  console.log("PaymentCompleted consumer started");

  app.listen(env.PORT, () => {
    console.log(`Booking service is running on port ${env.PORT}`);
  });
}

bootstrap().catch(console.error);
