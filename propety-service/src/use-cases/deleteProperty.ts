import { S3Service } from "../lib/aws/service/s3Service";
import { PropertyRepository } from "../repositories/property-repository";

export class DeletePropertyUseCase {
  constructor(
    private propertyRepository: PropertyRepository,
    private S3Service: S3Service,
  ) {}

  async execute(id: string) {
    const property = await this.propertyRepository.getPropertyById(id);

    if (!property) {
      throw new Error("Property not found");
    }

    if (property.propertyImages && Array.isArray(property.propertyImages)) {
      for (const image of property.propertyImages) {
        // Extraia o fileName da URL
        const urlParts = image.url.split("/");
        const fileName = urlParts[urlParts.length - 1];

        await this.S3Service.deletePropertyImage(property.id, fileName);
      }
    }

    await this.propertyRepository.deleteProperty(id);
  }
}
