import z from "zod";

export const EditPropertyParamsSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  country: z.string().min(1, "Country is required").optional(),
  price_per_night: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z.number().positive("Price per night must be positive").optional(),
  ),
  max_guests: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z
      .number()
      .int()
      .positive("Max guests must be a positive integer")
      .optional(),
  ),
  isActive: z.boolean().optional(),
});

export type EditPropertyParams = z.infer<typeof EditPropertyParamsSchema>;
