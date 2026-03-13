import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

export class SearchPropertiesByCity {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(city: string) {
    const properties =
      await this.propertyRepository.searchPropertiesByCity(city);

    if (properties.length == 0) {
      throw new NoPropertiesFoundError();
    }

    return properties;
  }
}
