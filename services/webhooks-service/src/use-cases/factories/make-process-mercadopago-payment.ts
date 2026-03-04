import { getRabbitmqChannel } from "../../lib/rabbitmq/connection";
import { RabbitmqClient } from "../../lib/rabbitmq/rabbimtqClient";
import { ProcessMercadoPagoPaymentUseCase } from "../processMercadoPagoPaymentUseCase";

export async function makeProcessMercadoPagoPaymentUseCase() {
  const channel = await getRabbitmqChannel();
  const eventPublisher = new RabbitmqClient(channel);
  const processMercadoPagoPaymentUseCase = new ProcessMercadoPagoPaymentUseCase(
    eventPublisher,
  );

  return processMercadoPagoPaymentUseCase;
}
