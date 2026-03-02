import { PropertyRepository } from "../repositories/property-repository";

export class GetAllAvailableUseCase {
  constructor(private propertyRepository: PropertyRepository) {}
  async execute() {
    const properties = await this.propertyRepository.getAllAvailablePropeties();

    if (properties.length == 0) {
      throw new Error("No properties were found");
    }

    return properties;
  }
}
