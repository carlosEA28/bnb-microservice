import { Request, Response } from "express";
import { makeGetBookingsByGuestUseCase } from "../../use-cases/factories/make-get-bookings-by-guest";

export async function getBookingsByGuest(req: Request, res: Response) {
  const guestId = req.params.guestId;

  try {
    const getBookingsByGuestUseCase = makeGetBookingsByGuestUseCase();

    const bookings = await getBookingsByGuestUseCase.execute(String(guestId));

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error getting bookings by guest:", error);

    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get bookings" });
  }
}
