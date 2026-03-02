import { Request, Response } from "express";
import { CreateUserDto } from "../../dtos/createUserDTO";
import { makeCreateUserUseCase } from "../../use-cases/factories/make-create-user";

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
    return response.status(500).json({ error: "Failed to create user" });
  }
}
