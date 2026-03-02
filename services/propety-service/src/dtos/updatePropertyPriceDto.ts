import z from "zod";

export const UpdatePropertyPriceParamsSchema = z.object({
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Price must be greater than zero"),
  ),
});

export type UpdatePropertyPriceParams = z.infer<
  typeof UpdatePropertyPriceParamsSchema
>;
