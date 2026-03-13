import { Request, Response } from "express";
import { makeGetAllProperties } from "../../use-cases/factories/make-get-all-properties";
import { NoPropertiesFoundError } from "../../use-cases/errors";

export async function getAllProperties(req: Request, res: Response) {
  try {
    const propertyUseCase = makeGetAllProperties();

    const properties = await propertyUseCase.execute();

    res.status(200).send(properties);
  } catch (error) {
    if (error instanceof NoPropertiesFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Failed to delete property", message: error });
  }
}
