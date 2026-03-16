import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { GetAllBookingsUseCase } from "./getAllBookings";
import { NoBookingsFoundError } from "./errors";

let bookingRepository: BookingRepository;
let sut: GetAllBookingsUseCase;

describe("Get All Bookings Use Case", () => {
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

    sut = new GetAllBookingsUseCase(bookingRepository);
  });

  it("should return all bookings", async () => {
    vi.mocked(bookingRepository.getAllBookings).mockResolvedValueOnce([
      { id: faker.string.uuid() },
      { id: faker.string.uuid() },
    ] as any);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
  });

  it("should throw NoBookingsFoundError when there are no bookings", async () => {
    vi.mocked(bookingRepository.getAllBookings).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toBeInstanceOf(NoBookingsFoundError);
  });
});
