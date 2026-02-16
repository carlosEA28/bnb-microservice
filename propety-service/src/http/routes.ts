import { Router } from "express";
import { upload } from "./middlewares/multer";
import { createProperty } from "./controller/createProperty";
import { deleteProperty } from "./controller/delteProperty";
import { getAllProperties } from "./controller/getAllProperties";

export const Approutes = Router();

Approutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: "property-service" });
});

// Property routes(fazer autenticada dps quando passar o barer Token)
Approutes.post("/properties", upload.array("images", 10), createProperty);
Approutes.get("/properties", getAllProperties);
Approutes.delete("/properties/:id", deleteProperty);
