import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { EditPropertyUseCase } from "./editProperty";
import { PropertyRepository } from "../repositories/property-repository";
import { PropertyNotFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let sut: EditPropertyUseCase;

describe("Edit Property Use Case", () => {
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

    sut = new EditPropertyUseCase(propertyRepository);
  });

  it("should be able to edit a property", async () => {
    const propertyId = faker.string.uuid();

    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce({
      id: propertyId,
    } as any);

    vi.mocked(propertyRepository.editProperty).mockResolvedValueOnce({
      id: propertyId,
      title: "updated title",
      city: "updated city",
    } as any);

    const result = await sut.execute(propertyId, {
      title: "updated title",
      city: "updated city",
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: propertyId,
        title: "updated title",
      }),
    );
  });

  it("should throw PropertyNotFoundError when property does not exist", async () => {
    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce(
      null as any,
    );

    await expect(
      sut.execute(faker.string.uuid(), {
        title: "new title",
      }),
    ).rejects.toBeInstanceOf(PropertyNotFoundError);
  });

  it("should not edit property with invalid payload", async () => {
    const propertyId = faker.string.uuid();

    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce({
      id: propertyId,
    } as any);

    await expect(
      sut.execute(propertyId, {
        price_per_night: -100,
      }),
    ).rejects.toThrow("Price per night must be positive");
  });
});
