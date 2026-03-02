import { Request, Response } from "express";
import { makeCreatePropertyUseCase } from "../../use-cases/factories/make-create-property";
import { ZodError } from "zod";

export async function createProperty(request: Request, response: Response) {
  const files = request.files as Express.Multer.File[];

  // TODO: Obter o hostId do token JWT após autenticação ser implementada
  const hostId = (request.headers["x-user-id"] as string) || "temp-host-id";

  try {
    const createPropertyUseCase = makeCreatePropertyUseCase();

    const property = await createPropertyUseCase.execute(
      {
        ...request.body,
        hostId,
      },
      files,
    );

    return response.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);

    if (error instanceof ZodError) {
      return response.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    if (error instanceof Error) {
      return response.status(400).json({ error: error.message });
    }

    return response.status(500).json({ error: "Failed to create property" });
  }
}
