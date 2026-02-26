package events

type PaymentCreated struct {
	BookingID  string `json:"bookingId"`
	PaymentURL string `json:"paymentUrl"`
	Status     string `json:"status"`
}

func NewPaymentCreated(bookingID, paymentURL, status string) *PaymentCreated {
	return &PaymentCreated{
		BookingID:  bookingID,
		PaymentURL: paymentURL,
		Status:     status,
	}
}
