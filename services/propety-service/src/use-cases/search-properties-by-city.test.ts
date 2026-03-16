import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { SearchPropertiesByCity } from "./searchPropertiesByCity";
import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: SearchPropertiesByCity;

describe("Search Properties By City Use Case", () => {
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

    sut = new SearchPropertiesByCity(propertyRepository);
  });

  it("should return properties when city has matches", async () => {
    const city = faker.location.city();

    vi.mocked(propertyRepository.searchPropertiesByCity).mockResolvedValueOnce([
      { id: faker.string.uuid(), city },
    ] as any);

    const result = await sut.execute(city);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({ city }));
  });

  it("should throw NoPropertiesFoundError when city has no matches", async () => {
    vi.mocked(propertyRepository.searchPropertiesByCity).mockResolvedValueOnce(
      [],
    );

    await expect(sut.execute(faker.location.city())).rejects.toBeInstanceOf(
      NoPropertiesFoundError,
    );
  });
});
