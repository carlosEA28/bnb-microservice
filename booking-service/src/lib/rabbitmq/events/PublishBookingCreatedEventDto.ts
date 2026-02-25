import z from "zod";

export const PublishBookingCreatedEventDto = z.object({
  bookingId: z.string(),
  userId: z.string(),
  // title: z.string(),
  Amount: z.number(),
});

export type PublishBookingCreatedEventDto = z.infer<
  typeof PublishBookingCreatedEventDto
>;
