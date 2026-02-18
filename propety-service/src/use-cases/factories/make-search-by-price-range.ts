import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { SearchPropertiesByPriceRangeUseCase } from "../searchPropertiesByPriceRange";

export function makeSearchPropertiesByPriceRangeUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const searchPropertiesByPriceRangeUseCase =
    new SearchPropertiesByPriceRangeUseCase(prismaPropertyRepository);

  return searchPropertiesByPriceRangeUseCase;
}
