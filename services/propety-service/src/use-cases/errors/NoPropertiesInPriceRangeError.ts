export class NoPropertiesInPriceRangeError extends Error {
  constructor(minPrice: number, maxPrice: number) {
    super(`No properties found in price range ${minPrice} - ${maxPrice}`);
    this.name = "NoPropertiesInPriceRangeError";
  }
}
