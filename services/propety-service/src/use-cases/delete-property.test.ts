import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { DeletePropertyUseCase } from "./deleteProperty";
import { PropertyRepository } from "../repositories/property-repository";
import { S3Service } from "../lib/aws/service/s3Service";
import { PropertyNotFoundError } from "./errors";

let propertyRepository: PropertyRepository;
let mockS3Service: S3Service;
let sut: DeletePropertyUseCase;

describe("Delete Property Use Case", () => {
  beforeEach(() => {
    propertyRepository = {
      createProperty: vi.fn(),
      editProperty: vi.fn(),
      deleteProperty: vi.fn().mockResolvedValue(undefined),
      updatePropertyPrice: vi.fn(),
      updatePropertyAvailability: vi.fn(),
      searchPropertiesByCity: vi.fn(),
      searchPropertiesByCountry: vi.fn(),
      searchPropertiesByPriceRange: vi.fn(),
      getPropertyById: vi.fn(),
      getAllProperties: vi.fn(),
      getAllAvailablePropeties: vi.fn(),
    };

    mockS3Service = {
      deletePropertyImage: vi.fn().mockResolvedValue(undefined),
    } as unknown as S3Service;

    sut = new DeletePropertyUseCase(propertyRepository, mockS3Service);
  });

  it("should be able to delete a property", async () => {
    const propertyId = faker.string.uuid();

    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce({
      id: propertyId,
      propertyImages: [
        { url: `https://cdn.example.com/${faker.system.fileName()}` },
        { url: `https://cdn.example.com/${faker.system.fileName()}` },
      ],
    } as any);

    await sut.execute(propertyId);

    expect(vi.mocked(mockS3Service.deletePropertyImage)).toHaveBeenCalledTimes(
      2,
    );
    expect(vi.mocked(propertyRepository.deleteProperty)).toHaveBeenCalledWith(
      propertyId,
    );
  });

  it("should throw PropertyNotFoundError when property does not exist", async () => {
    vi.mocked(propertyRepository.getPropertyById).mockResolvedValueOnce(
      null as any,
    );

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      PropertyNotFoundError,
    );
  });
});
