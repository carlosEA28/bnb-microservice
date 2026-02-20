package main

import (
	"github.com/carlosEA28/payment-service/internal/web/server"
	//"github.com/joho/godotenv"
	"log"
	"os"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	port := getEnv("HTTP_PORT", "3003")
	srv := server.NewServer(port)

	if err := srv.Start(); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
