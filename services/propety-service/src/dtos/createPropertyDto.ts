import z from "zod";

export const CreatePropertyParamsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  amenities: z.preprocess(
    (val) => (Array.isArray(val) ? val : [val]),
    z.array(z.string()).min(1, "At least one amenity is required"),
  ),
  price_per_night: z.preprocess(
    (val) => Number(val),
    z.number().positive("Price per night must be positive"),
  ),
  max_guests: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("Max guests must be a positive integer"),
  ),
  hostId: z.string(),
});

export type CreatePropertyParams = z.infer<typeof CreatePropertyParamsSchema>;

export const CreatePropertyDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  city: z.string(),
  country: z.string(),
  isActive: z.boolean().default(true),
  propertyImages: z.array(z.string()),
  amenities: z.array(z.string()),
  price_per_night: z.number(),
  max_guests: z.number().int(),
  host_id: z.string(),
});

export type CreatePropertyData = z.infer<typeof CreatePropertyDataSchema>;
