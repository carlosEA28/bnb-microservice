import { Booking, BookingStatus } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { BookingRepository } from "../booking-repository";
import { CreateBookingData } from "../../dtos/createBookingDto";

export class PrismaBookingRepository implements BookingRepository {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    return await prisma.booking.create({
      data: {
        propertyId: data.propertyId,
        guestId: data.guestId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: data.totalPrice,
        status: "PENDING",
        availability: "UNAVAILABLE",
      },
    });
  }

  async cancelBooking(id: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        availability: "AVAILABLE",
      },
    });
  }

  async confirmBooking(id: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: "CONFIRMED",
      },
    });
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
    });
  }

  async getBookingsByGuest(guestId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { guestId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBookingsByProperty(propertyId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { propertyId },
      orderBy: { checkIn: "asc" },
    });
  }

  async getActiveBookingsByProperty(propertyId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: {
        propertyId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      orderBy: { checkIn: "asc" },
    });
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<Booking> {
    const availability = status === "CANCELLED" ? "AVAILABLE" : "UNAVAILABLE";

    return await prisma.booking.update({
      where: { id },
      data: {
        status,
        availability,
      },
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
