import { CreatePropertyData } from "../dtos/createPropertyDto";
import { EditPropertyParams } from "../dtos/editPropertyDto";
import { Property } from "../generated/prisma/client";

export interface PropertyRepository {
  // autenticado
  createProperty(data: CreatePropertyData): Promise<any>;
  editProperty(id: string, property: EditPropertyParams): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  updatePropertyPrice(id: string, price: number): Promise<Property>;
  updatePropertyAvailability(id: string, availability: boolean): Promise<any>;

  // publico
  searchPropertiesByCity(city: string): Promise<Property[]>;
  searchPropertiesByCountry(country: string): Promise<Property[]>;
  searchPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property>;
  getAllProperties(): Promise<Property[]>;
  getAllAvailablePropeties(): Promise<Property[]>;
}
