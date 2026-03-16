import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { GetAllPropertiesUseCase } from "./getAllProperties";
import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: GetAllPropertiesUseCase;

describe("Get All Properties Use Case", () => {
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

    sut = new GetAllPropertiesUseCase(propertyRepository);
  });

  it("should return all properties", async () => {
    vi.mocked(propertyRepository.getAllProperties).mockResolvedValueOnce([
      { id: faker.string.uuid() },
      { id: faker.string.uuid() },
    ] as any);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
  });

  it("should throw NoPropertiesFoundError when there are no properties", async () => {
    vi.mocked(propertyRepository.getAllProperties).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toBeInstanceOf(NoPropertiesFoundError);
  });
});
