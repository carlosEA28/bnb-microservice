import { CreatePropertyData } from "../dtos/createPropertyDto";
import { Property } from "../generated/prisma/client";

export interface PropertyRepository {
  // autenticado
  createProperty(data: CreatePropertyData): Promise<any>;
  editProperty(id: string, property: any): Promise<any>;
  deleteProperty(id: string): Promise<void>;
  updatePropertyPrice(id: string, price: number): Promise<any>;
  updatePropertyAvailability(id: string, availability: boolean): Promise<any>;

  // publico
  searchPropertiesByCity(city: string): Promise<Property[]>;
  searchPropertiesByCountry(country: string): Promise<Property[]>;
  searchPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<any[]>;
  getPropertyById(id: string): Promise<Property>;
  getAllProperties(): Promise<Property[]>;
  getAllAvailablePropeties(): Promise<Property[]>;
}
