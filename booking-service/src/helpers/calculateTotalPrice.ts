export function calculateTotalPrice(
  checkIn: Date,
  checkOut: Date,
  pricePerNight: number,
): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (numberOfNights <= 0) {
    throw new Error("Check-out date must be after check-in date");
  }

  return numberOfNights * pricePerNight;
}

export function getNumberOfNights(checkIn: Date, checkOut: Date): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}
