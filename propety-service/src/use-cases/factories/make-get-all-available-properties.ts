import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { GetAllAvailableUseCase } from "../getAllAvailableProperties";

export function makeGetAllAvailablePropertiesUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const getAllAvailablePropertiesUseCase = new GetAllAvailableUseCase(
    prismaPropertyRepository,
  );

  return getAllAvailablePropertiesUseCase;
}
