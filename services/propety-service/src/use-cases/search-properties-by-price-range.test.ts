import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { SearchPropertiesByPriceRangeUseCase } from "./searchPropertiesByPriceRange";
import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesInPriceRangeError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: SearchPropertiesByPriceRangeUseCase;

describe("Search Properties By Price Range Use Case", () => {
  beforeEach(() => {
    propertyRepository = {
      createProperty: vi.fn(),
      editProperty: vi.fn(),
      deleteProperty: vi.fn(),
      updatePropertyPrice: vi.fn(),
      updatePropertyAvailability: vi.fn(),
      searchPropertiesByCity: vi.fn(),
      searchPropertiesByCountry: vi.fn(),
      searchPropertiesByPriceRange: vi.fn(),
      getPropertyById: vi.fn(),
      getAllProperties: vi.fn(),
      getAllAvailablePropeties: vi.fn(),
    };

    sut = new SearchPropertiesByPriceRangeUseCase(propertyRepository);
  });

  it("should return properties in the specified price range", async () => {
    const minPrice = 100;
    const maxPrice = 400;

    vi.mocked(
      propertyRepository.searchPropertiesByPriceRange,
    ).mockResolvedValueOnce([
      { id: faker.string.uuid(), price_per_night: 250 },
    ] as any);

    const result = await sut.execute({ minPrice, maxPrice });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({ price_per_night: 250 }),
    );
  });

  it("should throw NoPropertiesInPriceRangeError when there are no matches", async () => {
    const minPrice = 100;
    const maxPrice = 400;

    vi.mocked(
      propertyRepository.searchPropertiesByPriceRange,
    ).mockResolvedValueOnce([]);

    await expect(sut.execute({ minPrice, maxPrice })).rejects.toBeInstanceOf(
      NoPropertiesInPriceRangeError,
    );
  });

  it("should not search properties when minimum price is greater than maximum price", async () => {
    await expect(
      sut.execute({
        minPrice: 500,
        maxPrice: 100,
      }),
    ).rejects.toThrow("Minimum price cannot be greater than maximum price");
  });
});
