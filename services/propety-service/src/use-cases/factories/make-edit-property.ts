import { PrismaPropertyRepository } from "../../repositories/prisma/prisma-property-repository";
import { EditPropertyUseCase } from "../editProperty";

export function makeEditPropertyUseCase() {
  const prismaPropertyRepository = new PrismaPropertyRepository();

  const editPropertyUseCase = new EditPropertyUseCase(prismaPropertyRepository);

  return editPropertyUseCase;
}
