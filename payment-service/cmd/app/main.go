package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/carlosEA28/payment-service/internal/web/server"
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

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", ""),
		getEnv("DB_PORT", ""),
		getEnv("DB_USER", ""),
		getEnv("DB_PASSWORD", ""),
		getEnv("DB_NAME", ""),
		getEnv("DB_SSL_MODE", ""),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}
	defer db.Close()

	if err := srv.Start(); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
