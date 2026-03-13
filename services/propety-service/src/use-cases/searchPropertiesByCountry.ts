import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

export class SearchPropertiesByCountry {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(country: string) {
    const properties =
      await this.propertyRepository.searchPropertiesByCountry(country);

    if (properties.length == 0) {
      throw new NoPropertiesFoundError();
    }

    return properties;
  }
}
