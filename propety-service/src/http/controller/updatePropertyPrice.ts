import { Request, Response } from "express";
import { makeUpdatePropertyPriceUseCase } from "../../use-cases/factories/make-update-property-price";
import { ZodError } from "zod";

export async function updatePropertyPrice(req: Request, res: Response) {
  const propertyId = req.params.id as string;

  try {
    const updatePropertyPriceUseCase = makeUpdatePropertyPriceUseCase();

    const property = await updatePropertyPriceUseCase.execute(
      propertyId,
      req.body,
    );

    return res.status(200).json({
      message: "Property price updated successfully",
      property,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Failed to update property price", message: error });
  }
}
