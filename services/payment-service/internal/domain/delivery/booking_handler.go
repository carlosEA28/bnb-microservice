package delivery

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/carlosEA28/payment-service/internal/domain/events"
	"github.com/carlosEA28/payment-service/internal/dto"
	"github.com/carlosEA28/payment-service/internal/service"
	amqp "github.com/rabbitmq/amqp091-go"
)

type PaymentHandler struct {
	useCase   *service.PaymentUseCase
	publisher *service.Publisher
}

func NewPaymentHandler(useCase *service.PaymentUseCase, publisher *service.Publisher) *PaymentHandler {
	return &PaymentHandler{
		useCase:   useCase,
		publisher: publisher,
	}
}

func (h *PaymentHandler) HandleMessage(delivery amqp.Delivery) error {
	var event events.BookingCreated

	if err := json.Unmarshal(delivery.Body, &event); err != nil {
		return fmt.Errorf("erro ao decodificar JSON: %w", err)
	}

	paymentURL, err := h.useCase.CreatePayment(dto.CreatePaymentDto{
		BookingID: event.BookingID,
		UserID:    event.UserID,
		Amount:    event.Amount,
	})
	if err != nil {
		return fmt.Errorf("erro ao criar pagamento: %w", err)
	}

	// Publica evento payment.created com a URL
	paymentCreatedEvent := events.NewPaymentCreated(event.BookingID, paymentURL, "PENDING")
	if err := h.publisher.Publish("payment.created", paymentCreatedEvent); err != nil {
		log.Printf("erro ao publicar payment.created: %v", err)
		return fmt.Errorf("erro ao publicar evento: %w", err)
	}

	log.Printf("Payment created for booking %s, URL published", event.BookingID)
	return nil
}
