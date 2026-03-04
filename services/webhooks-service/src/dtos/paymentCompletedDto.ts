import z from "zod";

export const PaymentCompletedDto = z.object({
  bookingId: z.string(),
  paymentId: z.string(),
  amount: z.number(),
  paidAt: z.date(),
});
