import { CognitoService } from "../../lib/aws/services/cognitoService";
import { S3Service } from "../../lib/aws/services/s3Service";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { DeleteUserUseCase } from "../deleteUser";

export function makeDeleteUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const cognitoService = new CognitoService();
  const s3Service = new S3Service();

  const deleteUserUseCase = new DeleteUserUseCase(
    prismaUserRepository,
    cognitoService,
    s3Service,
  );

  return deleteUserUseCase;
}
