import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { GetBookingByIdUseCase } from "./getBookingById";
import { BookingNotFoundError } from "./errors";

let bookingRepository: BookingRepository;
let sut: GetBookingByIdUseCase;

describe("Get Booking By ID Use Case", () => {
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

    sut = new GetBookingByIdUseCase(bookingRepository);
  });

  it("should return booking by id", async () => {
    const bookingId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce({
      id: bookingId,
      status: "PENDING",
    } as any);

    const result = await sut.execute(bookingId);

    expect(result).toEqual(
      expect.objectContaining({
        id: bookingId,
      }),
    );
  });

  it("should throw BookingNotFoundError when booking does not exist", async () => {
    vi.mocked(bookingRepository.getBookingById).mockResolvedValueOnce(null);

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      BookingNotFoundError,
    );
  });
});
