package service

import (
	"testing"

	"github.com/carlosEA28/payment-service/internal/domain"
	"github.com/carlosEA28/payment-service/internal/dto"
)

// Mock repository para testes
type MockPaymentRepository struct {
	paymentStore map[string]*domain.Payment
}

func NewMockPaymentRepository() *MockPaymentRepository {
	return &MockPaymentRepository{
		paymentStore: make(map[string]*domain.Payment),
	}
}

func (m *MockPaymentRepository) CreatePayment(payment *domain.Payment) error {
	m.paymentStore[payment.Id] = payment
	return nil
}

func (m *MockPaymentRepository) GetByExternalReference(ref string) (*domain.Payment, error) {
	for _, p := range m.paymentStore {
		if p.ExternalReference == ref {
			return p, nil
		}
	}
	return nil, nil
}

func (m *MockPaymentRepository) GetByBookingID(bookingID string) (*domain.Payment, error) {
	for _, p := range m.paymentStore {
		if p.BookingID == bookingID {
			return p, nil
		}
	}
	return nil, nil
}

func (m *MockPaymentRepository) UpdateStatus(id string, status string) error {
	if p, exists := m.paymentStore[id]; exists {
		p.Status = status
	}
	return nil
}

// Testes
func TestCreatePaymentValidation_MissingBookingID(t *testing.T) {
	mockRepo := NewMockPaymentRepository()
	useCase := NewPaymentUseCase(mockRepo)

	input := dto.CreatePaymentDto{
		BookingID: "",
		UserID:    "user123",
		Amount:    10000,
	}

	_, err := useCase.CreatePayment(input)

	if err == nil {
		t.Error("Expected error for missing booking_id, but got nil")
	}
}

func TestCreatePaymentValidation_MissingUserID(t *testing.T) {
	mockRepo := NewMockPaymentRepository()
	useCase := NewPaymentUseCase(mockRepo)

	input := dto.CreatePaymentDto{
		BookingID: "booking123",
		UserID:    "",
		Amount:    10000,
	}

	_, err := useCase.CreatePayment(input)

	if err == nil {
		t.Error("Expected error for missing user_id, but got nil")
	}
}

func TestCreatePaymentValidation_ValidInput(t *testing.T) {
	mockRepo := NewMockPaymentRepository()
	useCase := NewPaymentUseCase(mockRepo)

	// Note: This test will fail when trying to call Mercado Pago API
	// It's just testing the validation logic passes
	input := dto.CreatePaymentDto{
		BookingID: "booking123",
		UserID:    "user456",
		Amount:    10000,
	}

	// We expect this to fail due to missing credentials, not validation
	_, err := useCase.CreatePayment(input)

	// Should not be a validation error
	if err != nil && err.Error() == "booking_id e user_id são obrigatórios" {
		t.Error("Unexpected validation error")
	}
}
