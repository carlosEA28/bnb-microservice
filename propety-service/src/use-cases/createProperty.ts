import { PropertyRepository } from "../repositories/property-repository";
import { S3Service } from "../lib/aws/service/s3Service";
import { randomUUID } from "crypto";
import { CreatePropertyParamsSchema } from "../dtos/createPropertyDto";

export class CreatePropertyUseCase {
  constructor(
    private propertyRepository: PropertyRepository,
    private s3Service: S3Service,
  ) {}

  async execute(params: unknown, files: Express.Multer.File[]) {
    const validatedParams = CreatePropertyParamsSchema.parse(params);

    if (!files || files.length === 0) {
      throw new Error("At least one image is required");
    }

    const propertyId = randomUUID();

    const imageUrls = await this.s3Service.uploadPropertyImages(
      propertyId,
      files,
    );

    const property = await this.propertyRepository.createProperty({
      id: propertyId,
      title: validatedParams.title,
      description: validatedParams.description,
      city: validatedParams.city,
      country: validatedParams.country,
      price_per_night: validatedParams.price_per_night,
      max_guests: validatedParams.max_guests,
      host_id: validatedParams.hostId,
      isActive: true,
      amenities: validatedParams.amenities,
      propertyImages: imageUrls,
    });

    return property;
  }
}
