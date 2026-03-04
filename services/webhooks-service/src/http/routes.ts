import { Router } from "express";
import { processMercadoPagoWebhook } from "./controller/processMercadoPagoWebhook";

export const Approutes = Router();

Approutes.get("/webhooks/health", (req, res) => {
  res.json({ status: "ok", service: "webhooks-service" });
});

// Mercado Pago webhook
Approutes.post("/webhooks/mercadopago", processMercadoPagoWebhook);
