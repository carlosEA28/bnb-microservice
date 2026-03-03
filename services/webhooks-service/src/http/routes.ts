import { Router } from "express";

export const Approutes = Router();

Approutes.get("/webhooks/health", (req, res) => {
  res.json({ status: "ok", service: "webhooks-service" });
});
