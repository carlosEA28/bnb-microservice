import { CognitoService } from "../../lib/aws/services/cognitoService";
import { S3Service } from "../../lib/aws/services/s3Service";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "../createUser";

export function makeCreateUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const cognitoService = new CognitoService();
  const s3Service = new S3Service();

  const makeCreateUserUseCase = new CreateUserUseCase(
    prismaUserRepository,
    cognitoService,
    s3Service,
  );

  return makeCreateUserUseCase;
}
