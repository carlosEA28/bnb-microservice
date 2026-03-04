import { env } from "../../env/env";

export async function getPaymentDetails(paymentId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.statusText}`);
  }

  return await response.json();
}
