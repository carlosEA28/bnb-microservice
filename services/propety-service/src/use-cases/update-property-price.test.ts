import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { UpdatePropertyPriceUseCase } from "./updatePropertyPrice";
import { PropertyRepository } from "../repositories/property-repository";
import { PropertyNotFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: UpdatePropertyPriceUseCase;

describe("Update Property Price Use Case", () => {
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

    sut = new UpdatePropertyPriceUseCase(propertyRepository);
  });

  it("should be able to update property price", async () => {
    const propertyId = faker.string.uuid();

    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce({
      id: propertyId,
    } as any);

    vi.mocked(propertyRepository.updatePropertyPrice).mockResolvedValueOnce({
      id: propertyId,
      price_per_night: 500,
    } as any);

    const result = await sut.execute(propertyId, { price: 500 });

    expect(result).toEqual(
      expect.objectContaining({
        id: propertyId,
        price_per_night: 500,
      }),
    );
  });

  it("should throw PropertyNotFoundError when property does not exist", async () => {
    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce(
      null as any,
    );

    await expect(
      sut.execute(faker.string.uuid(), { price: 500 }),
    ).rejects.toBeInstanceOf(PropertyNotFoundError);
  });

  it("should not update property with invalid price", async () => {
    await expect(
      sut.execute(faker.string.uuid(), { price: 0 }),
    ).rejects.toThrow("Price must be greater than zero");
  });
});
