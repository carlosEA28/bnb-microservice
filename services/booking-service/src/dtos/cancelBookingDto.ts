import z from "zod";

export const CancelBookingParamsSchema = z.object({
  bookingId: z.string().uuid("Booking ID must be a valid UUID"),
});

export type CancelBookingParams = z.infer<typeof CancelBookingParamsSchema>;
