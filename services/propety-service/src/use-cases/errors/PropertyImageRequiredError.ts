export class PropertyImageRequiredError extends Error {
  constructor() {
    super("At least one image is required");
    this.name = "PropertyImageRequiredError";
  }
}
