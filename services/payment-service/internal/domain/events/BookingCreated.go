package events

type BookingCreated struct {
	BookingID string `json:"bookingId"`
	UserID    string `json:"userId"`
	Amount    int64  `json:"Amount"`
}

func NewBookingCreated(bookingID, userID string, amount int64) *BookingCreated {
	return &BookingCreated{
		BookingID: bookingID,
		UserID:    userID,
		Amount:    amount,
	}
}
