import { Request, Response } from "express";
import { makeSearchPropertiesByPriceRangeUseCase } from "../../use-cases/factories/make-search-by-price-range";
import { ZodError } from "zod";
import { SearchPropertiesByPriceRangeParams } from "../../dtos/searchPropertiesByPriceRangeDto";

export async function searchPropertiesByPriceRange(
  req: Request,
  res: Response,
) {
  try {
    const searchUseCase = makeSearchPropertiesByPriceRangeUseCase();

    const properties = await searchUseCase.execute(
      req.query as unknown as SearchPropertiesByPriceRangeParams,
    );

    res.status(200).json(properties);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Failed to search properties by price range",
      message: error,
    });
  }
}
