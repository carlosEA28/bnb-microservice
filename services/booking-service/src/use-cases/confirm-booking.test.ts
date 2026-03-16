import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { ConfirmBookingUseCase } from "./confirmBooking";
import {
  BookingAlreadyConfirmedError,
  BookingNotFoundError,
  CannotConfirmCancelledBookingError,
} from "./errors";

let bookingRepository: BookingRepository;
let sut: ConfirmBookingUseCase;

describe("Confirm Booking Use Case", () => {
  beforeEach(() => {
    bookingRepository = {
      createBooking: vi.fn(),
      cancelBooking: vi.fn(),
      confirmBooking: vi.fn(),
      getBookingById: vi.fn(),
      getBookingsByGuest: vi.fn(),
      getBookingsByProperty: vi.fn(),
      getActiveBookingsByProperty: vi.fn(),
      updateBookingStatus: vi.fn(),
      updatePaymentUrl: vi.fn(),
      getAllBookings: vi.fn(),
    };

    sut = new ConfirmBookingUseCase(bookingRepository);
  });

  it("should be able to confirm a booking", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "PENDING",
    } as any);

    vi.mocked(bookingRepository.confirmBooking).mockResolvedValueOnce({
      id: bookingId,
      status: "CONFIRMED",
    } as any);

    const result = await sut.execute(bookingId);

    expect(result).toEqual(
      expect.objectContaining({
        id: bookingId,
        status: "CONFIRMED",
      }),
    );
  });

  it("should throw BookingNotFoundError when booking does not exist", async () => {
    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce(null);

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      BookingNotFoundError,
    );
  });

  it("should throw CannotConfirmCancelledBookingError when booking is cancelled", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "CANCELLED",
    } as any);

    await expect(sut.execute(bookingId)).rejects.toBeInstanceOf(
      CannotConfirmCancelledBookingError,
    );
  });

  it("should throw BookingAlreadyConfirmedError when booking is already confirmed", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "CONFIRMED",
    } as any);

    await expect(sut.execute(bookingId)).rejects.toBeInstanceOf(
      BookingAlreadyConfirmedError,
    );
  });
});
