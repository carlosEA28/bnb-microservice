package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/carlosEA28/payment-service/internal/domain/delivery"
	"github.com/carlosEA28/payment-service/internal/repository"
	"github.com/carlosEA28/payment-service/internal/service"
	"github.com/carlosEA28/payment-service/internal/web/server"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("Arquivo .env não encontrado")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", ""),
		getEnv("DB_PORT", ""),
		getEnv("DB_USER", ""),
		getEnv("DB_PASSWORD", ""),
		getEnv("DB_NAME", ""),
		getEnv("DB_SSL_MODE", ""),
	)

	fmt.Println("DB_HOST:", os.Getenv("DB_HOST"))
	fmt.Println("DB_PORT:", os.Getenv("DB_PORT"))
	fmt.Println("DB_USER:", os.Getenv("DB_USER"))
	fmt.Println("DB_NAME:", os.Getenv("DB_NAME"))

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}
	defer db.Close()

	paymentRepository := repository.NewPaymentRepository(db)
	paymentUseCase := service.NewPaymentUseCase(paymentRepository)

	rabbitURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")

	// Cria o publisher para enviar eventos
	publisher, err := service.NewPublisher(rabbitURL)
	if err != nil {
		log.Fatal("Error creating RabbitMQ publisher: ", err)
	}
	defer publisher.Close()

	handler := delivery.NewPaymentHandler(paymentUseCase, publisher)

	consumer, err := service.NewConsumer(
		rabbitURL,
		"booking.created",
		handler,
	)

	if err != nil {
		log.Fatal("Error creating RabbitMQ consumer: ", err)
	}

	defer consumer.Close()

	if err := consumer.StartConsumer(); err != nil {
		log.Fatal("Error starting RabbitMQ consumer: ", err)
	}

	port := getEnv("HTTP_PORT", "3003")
	srv := server.NewServer(paymentUseCase, port)
	srv.ConfigureRoutes()

	if err := srv.Start(); err != nil {
		log.Fatal("Error starting server: ", err)
	}

	select {} // Keep the main function running

}
