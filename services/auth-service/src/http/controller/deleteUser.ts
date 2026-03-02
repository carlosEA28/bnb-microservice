import { Request, Response } from "express";
import { makeDeleteUserUseCase } from "../../use-cases/factories/make-delete-user";

export async function deleteUser(request: Request, response: Response) {
  const { id } = request.params as { id: string };

  if (!id) {
    return response.status(400).json({ error: "User ID is required" });
  }

  try {
    const deleteUserUseCase = makeDeleteUserUseCase();

    const result = await deleteUserUseCase.execute(id);

    return response.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "User not found") {
      return response.status(404).json({ error: "User not found" });
    }

    return response.status(500).json({ error: "Failed to delete user" });
  }
}
