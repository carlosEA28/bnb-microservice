import { PropertyRepository } from "../repositories/property-repository";
import {
  SearchPropertiesByPriceRangeParamsSchema,
  SearchPropertiesByPriceRangeParams,
} from "../dtos/searchPropertiesByPriceRangeDto";
import { NoPropertiesInPriceRangeError } from "./errors";

export class SearchPropertiesByPriceRangeUseCase {
  constructor(private propertyRepository: PropertyRepository) {}

  async execute(params: SearchPropertiesByPriceRangeParams) {
    const { minPrice, maxPrice } =
      SearchPropertiesByPriceRangeParamsSchema.parse(params);

    const properties =
      await this.propertyRepository.searchPropertiesByPriceRange(
        minPrice,
        maxPrice,
      );

    if (properties.length === 0) {
      throw new NoPropertiesInPriceRangeError(minPrice, maxPrice);
    }

    return properties;
  }
}
