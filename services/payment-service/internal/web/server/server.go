package server

import (
	"net/http"

	"github.com/carlosEA28/payment-service/internal/service"
	"github.com/carlosEA28/payment-service/internal/web/handlers"
	"github.com/go-chi/chi/v5"
)

type Server struct {
	router         *chi.Mux
	server         *http.Server
	paymentUseCase *service.PaymentUseCase
	port           string
}

func NewServer(paymentUseCase *service.PaymentUseCase, port string) *Server {
	return &Server{
		router:         chi.NewRouter(),
		paymentUseCase: paymentUseCase,
		port:           port,
	}
}

func (s *Server) ConfigureRoutes() {
	paymentHandler := handlers.NewPaymentHandler(*s.paymentUseCase)

	s.router.Post("/payment", paymentHandler.CreatePayment)

}
func (s *Server) Start() error {
	s.server = &http.Server{
		Addr:    ":" + s.port,
		Handler: s.router,
	}

	return s.server.ListenAndServe()
}
