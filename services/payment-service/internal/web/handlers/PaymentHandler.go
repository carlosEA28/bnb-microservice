package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/carlosEA28/payment-service/internal/dto"
	"github.com/carlosEA28/payment-service/internal/service"
)

type PaymentHandler struct {
	paymentService service.PaymentUseCase
}

func NewPaymentHandler(paymentService service.PaymentUseCase) *PaymentHandler {
	return &PaymentHandler{paymentService: paymentService}
}

func (h *PaymentHandler) CreatePayment(w http.ResponseWriter, r *http.Request) {

	var input dto.CreatePaymentDto

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	url, err := h.paymentService.CreatePayment(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(url)

}
