import { S3Service } from "../../lib/aws/service/s3Service";
import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { DeletePropertyUseCase } from "../deleteProperty";

export function makeDeltePropertyUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();
  const s3Service = new S3Service();

  const deletePropertyUseCase = new DeletePropertyUseCase(
    prismaPropertyRepository,
    s3Service,
  );

  return deletePropertyUseCase;
}
