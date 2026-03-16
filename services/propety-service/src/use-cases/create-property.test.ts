import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { CreatePropertyUseCase } from "./createProperty";
import { PropertyRepository } from "../repositories/property-repository";
import { S3Service } from "../lib/aws/service/s3Service";
import { PropertyImageRequiredError } from "./errors";

let propertyRepository: PropertyRepository;
let mockS3Service: S3Service;
let sut: CreatePropertyUseCase;

describe("Create Property Use Case", () => {
  beforeEach(() => {
    propertyRepository = {
      createProperty: vi.fn().mockImplementation(async (data) => data),
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

    mockS3Service = {
      uploadPropertyImages: vi
        .fn()
        .mockResolvedValue([faker.image.url(), faker.image.url()]),
      deletePropertyImage: vi.fn().mockResolvedValue(undefined),
    } as unknown as S3Service;

    sut = new CreatePropertyUseCase(propertyRepository, mockS3Service);
  });

  it("should be able to create a property", async () => {
    const files = [
      {
        originalname: faker.system.fileName({ extensionCount: 1 }),
        mimetype: "image/jpeg",
        buffer: Buffer.from("image-1"),
      },
      {
        originalname: faker.system.fileName({ extensionCount: 1 }),
        mimetype: "image/jpeg",
        buffer: Buffer.from("image-2"),
      },
    ] as Express.Multer.File[];

    const result = await sut.execute(
      {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        city: faker.location.city(),
        country: faker.location.country(),
        amenities: ["wifi", "pool"],
        price_per_night: 250,
        max_guests: 4,
        hostId: faker.string.uuid(),
      },
      files,
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        price_per_night: 250,
        max_guests: 4,
      }),
    );
    expect(vi.mocked(mockS3Service.uploadPropertyImages)).toHaveBeenCalledTimes(
      1,
    );
    expect(vi.mocked(propertyRepository.createProperty)).toHaveBeenCalledTimes(
      1,
    );
  });

  it("should throw PropertyImageRequiredError when no image is provided", async () => {
    await expect(
      sut.execute(
        {
          title: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          city: faker.location.city(),
          country: faker.location.country(),
          amenities: ["wifi"],
          price_per_night: 250,
          max_guests: 4,
          hostId: faker.string.uuid(),
        },
        [],
      ),
    ).rejects.toBeInstanceOf(PropertyImageRequiredError);
  });

  it("should not create a property with invalid payload", async () => {
    await expect(
      sut.execute(
        {
          title: "",
          description: faker.lorem.sentence(),
          city: faker.location.city(),
          country: faker.location.country(),
          amenities: ["wifi"],
          price_per_night: 250,
          max_guests: 4,
          hostId: faker.string.uuid(),
        },
        [
          {
            originalname: faker.system.fileName({ extensionCount: 1 }),
            mimetype: "image/jpeg",
            buffer: Buffer.from("image"),
          } as Express.Multer.File,
        ],
      ),
    ).rejects.toThrow("Title is required");
  });
});
