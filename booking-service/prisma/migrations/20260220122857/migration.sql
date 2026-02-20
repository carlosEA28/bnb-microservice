-- CreateEnum
CREATE TYPE "BookingAvailability" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "availability" "BookingAvailability" NOT NULL DEFAULT 'AVAILABLE';
