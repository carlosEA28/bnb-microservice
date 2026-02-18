import z from "zod";

export const SearchPropertiesByPriceRangeParamsSchema = z
  .object({
    minPrice: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative("Minimum price must be a positive number"),
    ),
    maxPrice: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative("Maximum price must be a positive number"),
    ),
  })
  .refine((data) => data.minPrice <= data.maxPrice, {
    message: "Minimum price cannot be greater than maximum price",
    path: ["minPrice"],
  });

export type SearchPropertiesByPriceRangeParams = z.infer<
  typeof SearchPropertiesByPriceRangeParamsSchema
>;
