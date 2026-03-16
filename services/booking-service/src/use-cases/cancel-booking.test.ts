import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { CancelBookingUseCase } from "./cancelBooking";
import { BookingAlreadyCancelledError, BookingNotFoundError } from "./errors";

let bookingRepository: BookingRepository;
let sut: CancelBookingUseCase;

describe("Cancel Booking Use Case", () => {
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

    sut = new CancelBookingUseCase(bookingRepository);
  });

  it("should be able to cancel a booking", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "PENDING",
    } as any);

    vi.mocked(bookingRepository.cancelBooking).mockResolvedValueOnce({
      id: bookingId,
      status: "CANCELLED",
    } as any);

    const result = await sut.execute(bookingId);

    expect(result).toEqual(
      expect.objectContaining({
        id: bookingId,
        status: "CANCELLED",
      }),
    );
  });

  it("should throw BookingNotFoundError when booking does not exist", async () => {
    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce(null);

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      BookingNotFoundError,
    );
  });

  it("should throw BookingAlreadyCancelledError when booking is already cancelled", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "CANCELLED",
    } as any);

    await expect(sut.execute(bookingId)).rejects.toBeInstanceOf(
      BookingAlreadyCancelledError,
    );
  });
});
