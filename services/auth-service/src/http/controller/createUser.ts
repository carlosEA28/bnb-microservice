import { Request, Response } from "express";
import { CreateUserDto } from "../../dtos/createUserDTO";
import { makeCreateUserUseCase } from "../../use-cases/factories/make-create-user";
import {
  CognitoUserCreationError,
  ImageUploadError,
  UserAlreadyExistsError,
} from "../../use-cases/errors";

export async function createUser(request: Request, response: Response) {
  const file = request.file;
  const { name, email, password } = CreateUserDto.parse(request.body);

  if (!file) {
    return response.status(400).json({ error: "Image file is required" });
  }

  try {
    const createUserUseCase = makeCreateUserUseCase();

    await createUserUseCase.execute(
      {
        name,
        email,
        password,
      },
      file,
    );

    return response.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);

    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).json({ error: error.message });
    }

    if (
      error instanceof CognitoUserCreationError ||
      error instanceof ImageUploadError
    ) {
      return response.status(502).json({ error: error.message });
    }

    return response.status(500).json({ error: "Failed to create user" });
  }
}
