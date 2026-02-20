import { Request, Response } from "express";
import { makeGetBookingByIdUseCase } from "../../use-cases/factories/make-get-booking-by-id";
import { BookingNotFoundError } from "../../use-cases/errors";

export async function getBookingById(req: Request, res: Response) {
  const bookingId = req.params.id;

  try {
    const getBookingByIdUseCase = makeGetBookingByIdUseCase();

    const booking = await getBookingByIdUseCase.execute(String(bookingId));

    return res.status(200).json(booking);
  } catch (error) {
    console.error("Error getting booking:", error);

    if (error instanceof BookingNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get booking" });
  }
}
