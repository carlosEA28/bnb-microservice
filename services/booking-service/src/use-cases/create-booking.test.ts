import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { BookingRepository } from "../repositories/booking-repository";
import { CreateBookingUseCase } from "./createBooking";
import { EventPublisher } from "../lib/rabbitmq/eventPublisher";
import { InvalidBookingDatesError, PropertyNotAvailableError } from "./errors";

let bookingRepository: BookingRepository;
let eventPublisher: EventPublisher;
let sut: CreateBookingUseCase;

describe("Create Booking Use Case", () => {
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

    eventPublisher = {
      PublishBookingCreated: vi.fn(),
    } as EventPublisher;

    sut = new CreateBookingUseCase(bookingRepository, eventPublisher);
  });

  it("should be able to create a booking", async () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 2);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);

    vi.mocked(
      bookingRepository.getActiveBookingsByProperty,
    ).mockResolvedValueOnce([]);

    vi.mocked(bookingRepository.createBooking).mockResolvedValueOnce({
      id: faker.string.uuid(),
      propertyId: faker.string.uuid(),
      guestId: faker.string.uuid(),
      checkIn,
      checkOut,
      totalPrice: 600,
      status: "PENDING",
      availability: "UNAVAILABLE",
    } as any);

    const result = await sut.execute({
      propertyId: faker.string.uuid(),
      guestId: faker.string.uuid(),
      checkIn,
      checkOut,
      pricePerNight: 200,
    });

    expect(result.id).toEqual(expect.any(String));
    expect(result.totalPrice).toBe(600);
    expect(
      vi.mocked(eventPublisher.PublishBookingCreated),
    ).toHaveBeenCalledTimes(1);
  });

  it("should throw InvalidBookingDatesError when dates are invalid", async () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() - 1);

    const checkOut = new Date();

    await expect(
      sut.execute({
        propertyId: faker.string.uuid(),
        guestId: faker.string.uuid(),
        checkIn,
        checkOut,
        pricePerNight: 200,
      }),
    ).rejects.toBeInstanceOf(InvalidBookingDatesError);
  });

  it("should throw PropertyNotAvailableError when property has overlapping booking", async () => {
    const propertyId = faker.string.uuid();
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 10);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);

    vi.mocked(
      bookingRepository.getActiveBookingsByProperty,
    ).mockResolvedValueOnce([
      {
        id: faker.string.uuid(),
        propertyId,
        guestId: faker.string.uuid(),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: "CONFIRMED",
      },
    ] as any);

    await expect(
      sut.execute({
        propertyId,
        guestId: faker.string.uuid(),
        checkIn,
        checkOut,
        pricePerNight: 200,
      }),
    ).rejects.toBeInstanceOf(PropertyNotAvailableError);
  });
});
