export class PropertyNotAvailableError extends Error {
  constructor(propertyId: string, checkIn: Date, checkOut: Date) {
    super(
      `Property ${propertyId} is not available from ${checkIn.toISOString()} to ${checkOut.toISOString()}`,
    );
    this.name = "PropertyNotAvailableError";
  }
}
