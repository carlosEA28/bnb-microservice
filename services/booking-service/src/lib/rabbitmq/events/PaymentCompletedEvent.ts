import z from "zod";

export const PaymentCompletedEvent = z.object({
  bookingId: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  paidAt: z.string(),
});

export type PaymentCompletedEventDto = z.infer<typeof PaymentCompletedEvent>;
