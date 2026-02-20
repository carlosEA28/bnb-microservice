import { Request, Response } from "express";
import { makeConfirmBookingUseCase } from "../../use-cases/factories/make-confirm-booking";
import { BookingNotFoundError } from "../../use-cases/errors";

export async function confirmBooking(req: Request, res: Response) {
  const bookingId = req.params.id;

  try {
    const confirmBookingUseCase = makeConfirmBookingUseCase();

    const booking = await confirmBookingUseCase.execute(String(bookingId));

    return res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);

    if (error instanceof BookingNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to confirm booking" });
  }
}
