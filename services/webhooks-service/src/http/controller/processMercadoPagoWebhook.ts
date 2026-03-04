import { Request, Response } from "express";
import { makeProcessMercadoPagoPaymentUseCase } from "../../use-cases/factories/make-process-mercadopago-payment";

export async function processMercadoPagoWebhook(req: Request, res: Response) {
  const { type, data } = req.body;

  try {
    const processMercadoPagoPaymentUseCase =
      await makeProcessMercadoPagoPaymentUseCase();

    const result = await processMercadoPagoPaymentUseCase.execute(type, data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error processing Mercado Pago webhook:", error);

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to process webhook" });
  }
}
