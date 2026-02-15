import { CreatePropertyData } from "../dtos/createPropertyDto";

export interface PropertyRepository {
  // autenticado
  createProperty(data: CreatePropertyData): Promise<any>;
  editProperty(id: string, property: any): Promise<any>;
  deleteProperty(id: string): Promise<void>;
  updatePropertyPrice(id: string, price: number): Promise<any>;
  updatePropertyAvailability(id: string, availability: boolean): Promise<any>;

  // publico
  listProperties(filter: any): Promise<any[]>;
  searchPropertiesByCity(city: string): Promise<any[]>;
  searchPropertiesByCountry(country: string): Promise<any[]>;
  searchPropertiesByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<any[]>;
  getPropertyById(id: string): Promise<any>;
}
