import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { SearchPropertiesByCountry } from "../searchPropertiesByCountry";

export function makeSearchPropertiesByCountryUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const searchPropertiesByCountryUseCase = new SearchPropertiesByCountry(
    prismaPropertyRepository,
  );

  return searchPropertiesByCountryUseCase;
}
