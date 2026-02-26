package events

type BookingCreated struct {
	BookingID string
	UserID    string
	Amount    int64 `json:"amount"`
}

func NewBookingCreated(bookingID, userID string, amount int64) *BookingCreated {
	return &BookingCreated{
		BookingID: bookingID,
		UserID:    userID,
		Amount:    amount,
	}
}
