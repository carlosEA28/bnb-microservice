import { Request, Response } from "express";
import { makeSearchPropertiesByCountryUseCase } from "../../use-cases/factories/make-search-by-country";

export async function searchPropertiesByCountry(req: Request, res: Response) {
  try {
    const { country } = req.query;

    if (!country || typeof country !== "string") {
      return res
        .status(400)
        .json({ error: "Country query parameter is required" });
    }

    const searchUseCase = makeSearchPropertiesByCountryUseCase();

    const properties = await searchUseCase.execute(country);

    res.status(200).send(properties);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res
      .status(500)
      .json({
        error: "Failed to search properties by country",
        message: error,
      });
  }
}
