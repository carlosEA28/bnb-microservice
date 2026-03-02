import { S3Service } from "../../lib/aws/service/s3Service";
import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { CreatePropertyUseCase } from "../createProperty";

export function makeCreatePropertyUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();
  const s3Service = new S3Service();

  const createPropertyUseCase = new CreatePropertyUseCase(
    prismaPropertyRepository,
    s3Service,
  );

  return createPropertyUseCase;
}
