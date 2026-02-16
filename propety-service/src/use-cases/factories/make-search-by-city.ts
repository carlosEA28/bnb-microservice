import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { SearchPropertiesByCity } from "../searchPropertiesByCity";

export function makeSearchPropertiesByCityUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const searchPropertiesByCityUseCase = new SearchPropertiesByCity(
    prismaPropertyRepository,
  );

  return searchPropertiesByCityUseCase;
}
