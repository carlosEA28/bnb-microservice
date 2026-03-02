import { Property } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { PropertyRepository } from "../property-repository";
import { CreatePropertyData } from "../../dtos/createPropertyDto";
import { EditPropertyParams } from "../../dtos/editPropertyDto";

export class PrismaPropertyRepository implements PropertyRepository {
  async getAllProperties(): Promise<Property[]> {
    return await prisma.property.findMany();
  }
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

  async editProperty(
    id: string,
    property: EditPropertyParams,
  ): Promise<Property> {
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: property,
      include: {
        propertyImages: true,
        propertyAmenities: {
          include: { amenity: true },
        },
      },
    });

    return updatedProperty;
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

  async getPropertyById(id: string): Promise<Property> {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        propertyImages: true,
      },
    });

    return property!;
  }

  async updatePropertyPrice(id: string, price: number): Promise<Property> {
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        price_per_night: price,
      },
    });

    return updatedProperty;
  }

  updatePropertyAvailability(id: string, availability: boolean): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async searchPropertiesByCity(city: string): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        city: {
          equals: city,
          mode: "insensitive",
        },
      },
    });

    return properties;
  }

  async searchPropertiesByCountry(country: string): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        country: {
          equals: country,
          mode: "insensitive",
        },
      },
    });

    return properties;
  }

  async getAllAvailablePropeties(): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
    });

    return properties;
  }
  async searchPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Property[]> {
    const properties = await prisma.property.findMany({
      where: {
        price_per_night: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    });

    return properties;
  }
}
