import { Request, Response } from "express";
import { makeCancelBookingUseCase } from "../../use-cases/factories/make-cancel-booking";
import {
  BookingNotFoundError,
  BookingAlreadyCancelledError,
} from "../../use-cases/errors";

export async function cancelBooking(req: Request, res: Response) {
  const bookingId = req.params.id;

  try {
    const cancelBookingUseCase = makeCancelBookingUseCase();

    const booking = await cancelBookingUseCase.execute(String(bookingId));

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);

    if (error instanceof BookingNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof BookingAlreadyCancelledError) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to cancel booking" });
  }
}
