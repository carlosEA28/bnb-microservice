import { Request, Response } from "express";
import { makeCreateBookingUseCase } from "../../use-cases/factories/make-create-booking";
import { ZodError } from "zod";
import {
  PropertyNotAvailableError,
  InvalidBookingDatesError,
} from "../../use-cases/errors";

export async function createBooking(req: Request, res: Response) {
  const guestId = (req.headers["x-user-id"] as string) || req.body.guestId;

  try {
    const createBookingUseCase = await makeCreateBookingUseCase();

    const booking = await createBookingUseCase.execute({
      ...req.body,
      guestId,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.issues,
      });
    }

    if (error instanceof PropertyNotAvailableError) {
      return res.status(409).json({ error: error.message });
    }

    if (error instanceof InvalidBookingDatesError) {
      return res.status(400).json({ error: error.message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to create booking" });
  }
}
