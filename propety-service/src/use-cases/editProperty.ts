import { PropertyRepository } from "../repositories/property-repository";
import {
  EditPropertyParamsSchema,
  EditPropertyParams,
} from "../dtos/editPropertyDto";

export class EditPropertyUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(id: string, params: EditPropertyParams) {
    const validatedParams = EditPropertyParamsSchema.parse(params);

    const property = await this.propertyRepository.getPropertyById(id);

    if (!property) {
      throw new Error("Property not found");
    }

    const updatedProperty = await this.propertyRepository.editProperty(
      id,
      validatedParams,
    );

    return updatedProperty;
  }
}
