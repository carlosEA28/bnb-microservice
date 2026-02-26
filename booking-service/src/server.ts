import { app } from "./app";
import { env } from "./env/env";
import { PaymentCreatedConsumer } from "./lib/rabbitmq/paymentCreatedConsumer";
import { PrismaBookingRepository } from "./repositories/prisma/prisma-booking-repository";

async function bootstrap() {
  // Inicia o consumer de payment.created
  const bookingRepository = new PrismaBookingRepository();
  const paymentConsumer = new PaymentCreatedConsumer(bookingRepository);

  await paymentConsumer.start();
  console.log("Payment consumer started");

  app.listen(env.PORT, () => {
    console.log(`Booking service is running on port ${env.PORT}`);
  });
}

bootstrap().catch(console.error);
