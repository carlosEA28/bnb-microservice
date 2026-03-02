import z from "zod";

export const CreateBookingParamsSchema = z.object({
  propertyId: z.string().uuid("Property ID must be a valid UUID"),
  guestId: z.string().uuid("Guest ID must be a valid UUID"),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  pricePerNight: z.number().positive("Price per night must be positive"),
});

export type CreateBookingParams = z.infer<typeof CreateBookingParamsSchema>;

export const CreateBookingDataSchema = z.object({
  propertyId: z.string(),
  guestId: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  totalPrice: z.number(),
});

export type CreateBookingData = z.infer<typeof CreateBookingDataSchema>;
