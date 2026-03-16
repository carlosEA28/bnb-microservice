import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { GetBookingsByGuestUseCase } from "./getBookingsByGuest";
import { NoBookingsFoundForGuestError } from "./errors";

let bookingRepository: BookingRepository;
let sut: GetBookingsByGuestUseCase;

describe("Get Bookings By Guest Use Case", () => {
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

    sut = new GetBookingsByGuestUseCase(bookingRepository);
  });

  it("should return bookings by guest", async () => {
    const guestId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingsByGuest).mockResolvedValueOnce([
      { id: faker.string.uuid(), guestId },
      { id: faker.string.uuid(), guestId },
    ] as any);

    const result = await sut.execute(guestId);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ guestId }));
  });

  it("should throw NoBookingsFoundForGuestError when guest has no bookings", async () => {
    vi.mocked(bookingRepository.getBookingsByGuest).mockResolvedValueOnce([]);

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      NoBookingsFoundForGuestError,
    );
  });
});
