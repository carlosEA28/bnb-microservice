import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

export class GetAllAvailableUseCase {
  constructor(private propertyRepository: PropertyRepository) {}
  async execute() {
    const properties = await this.propertyRepository.getAllAvailablePropeties();

    if (properties.length == 0) {
      throw new NoPropertiesFoundError();
    }

    return properties;
  }
}
