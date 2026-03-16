import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { SearchPropertiesByCountry } from "./searchPropertiesByCountry";
import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: SearchPropertiesByCountry;

describe("Search Properties By Country Use Case", () => {
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

    sut = new SearchPropertiesByCountry(propertyRepository);
  });

  it("should return properties when country has matches", async () => {
    const country = faker.location.country();

    vi.mocked(
      propertyRepository.searchPropertiesByCountry,
    ).mockResolvedValueOnce([{ id: faker.string.uuid(), country }] as any);

    const result = await sut.execute(country);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({ country }));
  });

  it("should throw NoPropertiesFoundError when country has no matches", async () => {
    vi.mocked(
      propertyRepository.searchPropertiesByCountry,
    ).mockResolvedValueOnce([]);

    await expect(sut.execute(faker.location.country())).rejects.toBeInstanceOf(
      NoPropertiesFoundError,
    );
  });
});
