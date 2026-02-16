import { Router } from "express";
import { upload } from "./middlewares/multer";
import { createProperty } from "./controller/createProperty";
import { deleteProperty } from "./controller/delteProperty";
import { getAllProperties } from "./controller/getAllProperties";
import { getAllAvailableProperties } from "./controller/getAllAvailableProperties";
import { searchPropertiesByCity } from "./controller/searchPropertiesByCity";
import { searchPropertiesByCountry } from "./controller/searchPropertiesByCountry";

export const Approutes = Router();

Approutes.get("/health", (req, res) => {
  res.json({ status: "ok", service: "property-service" });
});

// Property routes(fazer autenticada dps quando passar o barer Token)
Approutes.post("/properties", upload.array("images", 10), createProperty);
Approutes.get("/properties", getAllProperties);
Approutes.get("/properties/available", getAllAvailableProperties);
Approutes.get("/properties/search/city", searchPropertiesByCity);
Approutes.get("/properties/search/country", searchPropertiesByCountry);
Approutes.delete("/properties/:id", deleteProperty);
