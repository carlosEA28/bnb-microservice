import { Request, Response } from "express";
import { LoginDto } from "../../dtos/loginDTO";
import { makeLoginUserUseCase } from "../../use-cases/factories/make-login-user";
import {
  AuthenticationFailedError,
  UserNotFoundError,
} from "../../use-cases/errors";

export async function login(request: Request, response: Response) {
  try {
    const { email, password } = LoginDto.parse(request.body);

    const loginUseCase = makeLoginUserUseCase();

    const result = await loginUseCase.execute({ email, password });

    return response
      .status(200)
      .json({ user: result.user, tokens: result.tokens });
  } catch (error) {
    console.error(error);

    if (
      error instanceof UserNotFoundError ||
      error instanceof AuthenticationFailedError
    ) {
      return response.status(401).json({ error: "Invalid credentials" });
    }

    return response.status(401).json({ error: "Invalid credentials" });
  }
}
