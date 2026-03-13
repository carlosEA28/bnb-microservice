export class PropertyNotFoundError extends Error {
  constructor(propertyId?: string) {
    super(
      propertyId
        ? `Property with ID ${propertyId} not found`
        : "Property not found",
    );
    this.name = "PropertyNotFoundError";
  }
}
