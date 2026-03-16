import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { GetAllAvailableUseCase } from "./getAllAvailableProperties";
import { PropertyRepository } from "../repositories/property-repository";
import { NoPropertiesFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: GetAllAvailableUseCase;

describe("Get All Available Properties Use Case", () => {
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

    sut = new GetAllAvailableUseCase(propertyRepository);
  });

  it("should return all available properties", async () => {
    vi.mocked(
      propertyRepository.getAllAvailablePropeties,
    ).mockResolvedValueOnce([
      { id: faker.string.uuid(), isActive: true },
      { id: faker.string.uuid(), isActive: true },
    ] as any);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
  });

  it("should throw NoPropertiesFoundError when no available property exists", async () => {
    vi.mocked(
      propertyRepository.getAllAvailablePropeties,
    ).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toBeInstanceOf(NoPropertiesFoundError);
  });
});
