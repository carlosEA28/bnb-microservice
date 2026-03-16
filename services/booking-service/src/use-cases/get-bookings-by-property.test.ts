import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { GetBookingsByPropertyUseCase } from "./getBookingsByProperty";
import { NoBookingsFoundForPropertyError } from "./errors";

let bookingRepository: BookingRepository;
let sut: GetBookingsByPropertyUseCase;

describe("Get Bookings By Property Use Case", () => {
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

    sut = new GetBookingsByPropertyUseCase(bookingRepository);
  });

  it("should return bookings by property", async () => {
    const propertyId = faker.string.uuid();

    vi.mocked(bookingRepository.getBookingsByProperty).mockResolvedValueOnce([
      { id: faker.string.uuid(), propertyId },
      { id: faker.string.uuid(), propertyId },
    ] as any);

    const result = await sut.execute(propertyId);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ propertyId }));
  });

  it("should throw NoBookingsFoundForPropertyError when property has no bookings", async () => {
    vi.mocked(bookingRepository.getBookingsByProperty).mockResolvedValueOnce(
      [],
    );

    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      NoBookingsFoundForPropertyError,
    );
  });
});
