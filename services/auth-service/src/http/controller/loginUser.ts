import { Request, Response } from "express";
import { LoginDto } from "../../dtos/loginDTO";
import { makeLoginUserUseCase } from "../../use-cases/factories/make-login-user";

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
    return response.status(401).json({ error: "Invalid credentials" });
  }
}
