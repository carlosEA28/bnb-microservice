import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { UpdatePropertyPriceUseCase } from "../updatePropertyPrice";

export function makeUpdatePropertyPriceUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const updatePropertyPriceUseCase = new UpdatePropertyPriceUseCase(
    prismaPropertyRepository,
  );

  return updatePropertyPriceUseCase;
}
