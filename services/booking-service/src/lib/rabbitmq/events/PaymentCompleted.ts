import z from "zod";

export const PaymentCreatedEvent = z.object({
  bookingId: z.string(),
  paymentUrl: z.string(),
  status: z.string(),
});

export type PaymentCreatedEventDto = z.infer<typeof PaymentCreatedEvent>;
