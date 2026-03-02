package dto

import (
	"time"

	"github.com/carlosEA28/payment-service/internal/domain"
)

type CreatePaymentDto struct {
	BookingID     string
	UserID        string
	Amount        int64  // em centavos!
	Currency      string // "brl"
	PaymentMethod string
}
type CreatePaymentDto3 struct {
	BookingID string
	UserID    string
	Amount    int64 // em centavos
}
type PaymentResponseDto struct {
	ID                string    `json:"id"`
	BookingID         string    `json:"booking_id"`
	UserID            string    `json:"user_id"`
	Amount            int64     `json:"amount"`
	Currency          string    `json:"currency"`
	PaymentMethod     string    `json:"payment_method"`
	ProviderPaymentID string    `json:"provider_payment_id,omitempty"`
	ExternalReference string    `json:"external_reference"`
	Status            string    `json:"status"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func ToPayment(input CreatePaymentDto) *domain.Payment {
	return &domain.Payment{
		BookingID:     input.BookingID,
		UserID:        input.UserID,
		Amount:        input.Amount,
		Currency:      input.Currency,
		PaymentMethod: input.PaymentMethod,
		Status:        "PENDING",
	}
}

func FromPayment(payment *domain.Payment) PaymentResponseDto {
	return PaymentResponseDto{
		ID:                payment.Id,
		BookingID:         payment.BookingID,
		UserID:            payment.UserID,
		Amount:            payment.Amount,
		Currency:          payment.Currency,
		PaymentMethod:     payment.PaymentMethod,
		ProviderPaymentID: payment.ProviderPaymentID,
		ExternalReference: payment.ExternalReference,
		Status:            payment.Status,
		CreatedAt:         payment.CreatedAt,
		UpdatedAt:         payment.UpdatedAt,
	}
}
