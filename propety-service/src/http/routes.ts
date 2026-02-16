import { Router } from "express";
import { upload } from "./middlewares/multer";
import { createProperty } from "./controller/createProperty";
import { deleteProperty } from "./controller/delteProperty";

export const Approutes = Router();

Approutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: "property-service" });
});

// Property routes
Approutes.post("/properties", upload.array("images", 10), createProperty);
Approutes.delete("/properties/:id", deleteProperty);
