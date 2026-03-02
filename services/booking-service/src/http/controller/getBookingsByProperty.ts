import { Request, Response } from "express";
import { makeGetBookingsByPropertyUseCase } from "../../use-cases/factories/make-get-bookings-by-property";

export async function getBookingsByProperty(req: Request, res: Response) {
  const propertyId = req.params.propertyId;

  try {
    const getBookingsByPropertyUseCase = makeGetBookingsByPropertyUseCase();

    const bookings = await getBookingsByPropertyUseCase.execute(
      String(propertyId),
    );

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings by property:", error);

    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get bookings" });
  }
}
