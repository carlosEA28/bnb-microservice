export interface PropertyRepository {
  createProperty(property: any): Promise<any>;
  editProperty(id: string, property: any): Promise<any>;
  deleteProperty(id: string): Promise<void>;
  getPropertyById(id: string): Promise<any>;
}
