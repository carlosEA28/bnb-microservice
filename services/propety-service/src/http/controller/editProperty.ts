import { Request, Response } from "express";
import { makeEditPropertyUseCase } from "../../use-cases/factories/make-edit-property";
import { ZodError } from "zod";

export async function editProperty(req: Request, res: Response) {
  const propertyId = req.params.id as string;

  try {
    const editPropertyUseCase = makeEditPropertyUseCase();

    const property = await editPropertyUseCase.execute(propertyId, req.body);

    return res.status(200).json({
      message: "Property updated successfully",
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
      .json({ error: "Failed to update property", message: error });
  }
}
