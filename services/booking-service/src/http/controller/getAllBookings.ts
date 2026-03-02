import { Request, Response } from "express";
import { makeGetAllBookingsUseCase } from "../../use-cases/factories/make-get-all-bookings";

export async function getAllBookings(req: Request, res: Response) {
  try {
    const getAllBookingsUseCase = makeGetAllBookingsUseCase();

    const bookings = await getAllBookingsUseCase.execute();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting all bookings:", error);

    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get bookings" });
  }
}
