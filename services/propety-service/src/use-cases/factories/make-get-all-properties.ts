import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { GetAllPropertiesUseCase } from "../getAllProperties";

export const makeGetAllProperties = () => {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const propertyUseCase = new GetAllPropertiesUseCase(prismaPropertyRepository);

  return propertyUseCase;
};
