import { PropertyRepository } from "../repositories/property-repository";
import {
  UpdatePropertyPriceParamsSchema,
  UpdatePropertyPriceParams,
} from "../dtos/updatePropertyPriceDto";

export class UpdatePropertyPriceUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(id: string, params: UpdatePropertyPriceParams) {
    const { price } = UpdatePropertyPriceParamsSchema.parse(params);

    const property = await this.propertyRepository.getPropertyById(id);

    if (!property) {
      throw new Error("Property not found");
    }

    const updatedProperty = await this.propertyRepository.updatePropertyPrice(
      id,
      price,
    );

    return updatedProperty;
  }
}
