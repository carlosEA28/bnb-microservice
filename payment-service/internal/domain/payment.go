package domain

import "time"

type Payment struct {
	Id                string
	BookingID         string
	UserID            string
	Amount            float64
	Currency          string
	PaymentMethod     string
	ProviderPaymentID string
	ExternalReference string
	Status            string
	CreatedAt         time.Time
	UpdatedAt         time.Time
}
