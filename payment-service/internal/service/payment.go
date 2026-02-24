package service

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/carlosEA28/payment-service/internal/domain"
	"github.com/carlosEA28/payment-service/internal/dto"
	"github.com/carlosEA28/payment-service/internal/repository"
	"github.com/google/uuid"
	"github.com/mercadopago/sdk-go/pkg/config"
	"github.com/mercadopago/sdk-go/pkg/preference"
)

type PaymentUseCase struct {
	paymentRepository repository.PaymentRepository
}

func NewPaymentUseCase(paymentRepository repository.PaymentRepository) *PaymentUseCase {
	return &PaymentUseCase{paymentRepository: paymentRepository}
}

func (s *PaymentUseCase) CreatePayment(input dto.CreatePaymentDto) error {

	if input.BookingID == "" || input.UserID == "" {
		return errors.New("booking_id e user_id são obrigatórios")
	}

	cfg, err := config.New(os.Getenv("MERCADO_PAGO_ACCESS_TOKEN"))
	if err != nil {
		return err
	}

	client := preference.NewClient(cfg)

	request := preference.Request{
		Items: []preference.ItemRequest{
			{
				Title:      "Booking " + input.BookingID,
				Quantity:   1,
				UnitPrice:  float64(input.Amount) / 100,
				CurrencyID: "BRL",
			},
		},
		ExternalReference: input.BookingID,
	}

	response, err := client.Create(context.Background(), request)
	if err != nil {
		return err
	}

	payment := &domain.Payment{
		Id:                uuid.New().String(),
		BookingID:         input.BookingID,
		UserID:            input.UserID,
		Amount:            input.Amount,
		Currency:          "BRL",
		PaymentMethod:     "CREDIT_CARD",
		ProviderPaymentID: response.ID,
		ExternalReference: input.BookingID,
	}

	fmt.Println(response.InitPoint)

	return s.paymentRepository.CreatePayment(payment)
}
