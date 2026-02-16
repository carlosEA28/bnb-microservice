import { Request, Response } from "express";
import { makeSearchPropertiesByCityUseCase } from "../../use-cases/factories/make-search-by-city";

export async function searchPropertiesByCity(req: Request, res: Response) {
  try {
    const { city } = req.query;

    if (!city || typeof city !== "string") {
      return res
        .status(400)
        .json({ error: "City query parameter is required" });
    }

    const searchUseCase = makeSearchPropertiesByCityUseCase();

    const properties = await searchUseCase.execute(city);

    res.status(200).send(properties);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Failed to search properties by city", message: error });
  }
}
