import { CognitoService } from "../../lib/aws/services/cognitoService";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { LoginUserUseCase } from "../loginUser";

export function makeLoginUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const cognitoService = new CognitoService();

  return new LoginUserUseCase(prismaUserRepository, cognitoService);
}
