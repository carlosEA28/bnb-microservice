import { PropertyRepository } from "../repositories/property-repository";

export class GetAllPropertiesUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute() {
    const properties = await this.propertyRepository.getAllProperties();

    if (properties.length == 0) {
      throw new Error("No properties were found");
    }

    return properties;
  }
}
