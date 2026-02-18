import { PropertyRepository } from "../repositories/property-repository";
import {
  SearchPropertiesByPriceRangeParamsSchema,
  SearchPropertiesByPriceRangeParams,
} from "../dtos/searchPropertiesByPriceRangeDto";

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
      throw new Error("No properties found in this price range");
    }

    return properties;
  }
}
