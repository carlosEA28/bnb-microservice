import { EventPublisher } from "../lib/rabbitmq/eventPublisher";
import { getPaymentDetails } from "../utils/http/getPaymentDetails";

export class ProcessMercadoPagoPaymentUseCase {
  constructor(private eventPublisher: EventPublisher) {}
  async execute(type: string, data: any) {
    if (type !== "payment") {
      return { processed: false, message: "Event type not supported" };
    }

    const payment = await getPaymentDetails(data.id);

    // pensar em salvar historico dps

    if (payment.status === "approved") {
      const paymentCompleted = {
        bookingId: payment.external_reference,
        paymentId: payment.id,
        amount: payment.transaction_amount,
        paidAt: payment.date_approved,
      };

      await this.eventPublisher.PublishPaymentCompleted(
        "payment.completed",
        JSON.stringify(paymentCompleted),
      );

      return {
        processed: true,
        status: "approved",
        bookingId: payment.external_reference,
      };
    }

    return {
      processed: true,
      status: payment.status,
    };
  }
}
