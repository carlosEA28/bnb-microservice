import { Router } from "express";
import { createProperty } from "./controller/createProperty";
import { upload } from "./middlewares/multer";

export const Approutes = Router();

Approutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: "property-service" });
});

// Property routes
Approutes.post("/properties", upload.array("images", 10), createProperty);
