import { Booking, BookingStatus } from "../generated/prisma/client";
import { CreateBookingData } from "../dtos/createBookingDto";

export interface BookingRepository {
  createBooking(data: CreateBookingData): Promise<Booking>;
  cancelBooking(id: string): Promise<Booking>;
  confirmBooking(id: string): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  getBookingsByGuest(guestId: string): Promise<Booking[]>;
  getBookingsByProperty(propertyId: string): Promise<Booking[]>;
  getActiveBookingsByProperty(propertyId: string): Promise<Booking[]>;
  updateBookingStatus(id: string, status: BookingStatus): Promise<Booking>;
  updatePaymentUrl(bookingId: string, paymentUrl: string): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
}
