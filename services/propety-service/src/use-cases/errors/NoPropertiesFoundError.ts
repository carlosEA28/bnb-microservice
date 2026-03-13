export class NoPropertiesFoundError extends Error {
  constructor() {
    super("No properties were found");
    this.name = "NoPropertiesFoundError";
  }
}
