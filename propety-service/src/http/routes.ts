import { Router } from "express";
import { upload } from "./middlewares/multer";
import { createProperty } from "./controller/createProperty";
import { deleteProperty } from "./controller/delteProperty";
import { getAllProperties } from "./controller/getAllProperties";
import { getAllAvailableProperties } from "./controller/getAllAvailableProperties";
import { searchPropertiesByCity } from "./controller/searchPropertiesByCity";
import { searchPropertiesByCountry } from "./controller/searchPropertiesByCountry";
import { searchPropertiesByPriceRange } from "./controller/searchPropertiesByPriceRange";
import { editProperty } from "./controller/editProperty";
import { updatePropertyPrice } from "./controller/updatePropertyPrice";

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
Approutes.get("/properties/search/price", searchPropertiesByPriceRange);
Approutes.put("/properties/:id", editProperty);
Approutes.patch("/properties/:id/price", updatePropertyPrice);
Approutes.delete("/properties/:id", deleteProperty);
