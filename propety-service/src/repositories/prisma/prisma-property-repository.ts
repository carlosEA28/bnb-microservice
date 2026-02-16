import { Property } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PropertyRepository } from "../property-repository";
import { CreatePropertyData } from "../../dtos/createPropertyDto";

export class PrismaPropertyRepository implements PropertyRepository {
  async createProperty(data: CreatePropertyData): Promise<Property> {
    const { id, propertyImages, amenities, ...propertyData } = data;

    return await prisma.$transaction(async (tx) => {
      return await tx.property.create({
        data: {
          id,
          ...propertyData,
          propertyImages: {
            create: propertyImages.map((url) => ({ url })),
          },
          propertyAmenities: {
            create: amenities.map((amenityName) => ({
              amenity: {
                connectOrCreate: {
                  where: { name: amenityName },
                  create: { name: amenityName },
                },
              },
            })),
          },
        },
        include: {
          propertyImages: true,
          propertyAmenities: {
            include: { amenity: true },
          },
        },
      });
    });
  }

  editProperty(id: string, property: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async deleteProperty(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.propertyImage.deleteMany({
        where: { property_id: id },
      });

      await tx.propertyAmenity.deleteMany({
        where: { property_id: id },
      });

      await tx.property.delete({
        where: { id },
      });
    });
  }

  updatePropertyPrice(id: string, price: number): Promise<any> {
    throw new Error("Method not implemented.");
  }
  updatePropertyAvailability(id: string, availability: boolean): Promise<any> {
    throw new Error("Method not implemented.");
  }
  listProperties(filter: any): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  searchPropertiesByCity(city: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  searchPropertiesByCountry(country: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  searchPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  async getPropertyById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        propertyImages: true,
      },
    });

    return property;
  }
}
