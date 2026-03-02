import { Request, Response } from "express";
import { makeDeltePropertyUseCase } from "../../use-cases/factories/make-delete-property";

export async function deleteProperty(req: Request, res: Response) {
  const propertyId = req.params.id;

  try {
    const deletePropertyUseCase = makeDeltePropertyUseCase();

    await deletePropertyUseCase.execute(String(propertyId));

    return res.status(204).send({
      message: "property deleted",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Failed to delete property", message: error });
  }
}
