package repository

import (
	"database/sql"
	"errors"

	"github.com/carlosEA28/payment-service/internal/domain"
)

type PaymentRepository interface {
	CreatePayment(payment *domain.Payment) error
	GetByExternalReference(ref string) (*domain.Payment, error)
	GetByBookingID(bookingID string) (*domain.Payment, error)
	UpdateStatus(id string, status string) error
}

type paymentRepository struct {
	db *sql.DB
}

func NewPaymentRepository(db *sql.DB) PaymentRepository {
	return &paymentRepository{
		db: db,
	}
}

func (r *paymentRepository) CreatePayment(payment *domain.Payment) error {
	return r.db.QueryRow(`
		INSERT INTO payment
		(booking_id, user_id, amount, currency, payment_method,
		 provider_payment_id, external_reference, status)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
		RETURNING id, created_at, updated_at
	`,
		payment.BookingID,
		payment.UserID,
		payment.Amount,
		payment.Currency,
		payment.PaymentMethod,
		payment.ProviderPaymentID,
		payment.ExternalReference,
		payment.Status,
	).Scan(
		&payment.Id,
		&payment.CreatedAt,
		&payment.UpdatedAt,
	)
}

func (r *paymentRepository) GetByExternalReference(ref string) (*domain.Payment, error) {
	row := r.db.QueryRow(`
		SELECT id, booking_id, user_id, amount, currency,
		       payment_method, provider_payment_id,
		       external_reference, status, created_at, updated_at
		FROM payment
		WHERE external_reference = $1
	`, ref)

	var p domain.Payment

	err := row.Scan(
		&p.Id,
		&p.BookingID,
		&p.UserID,
		&p.Amount,
		&p.Currency,
		&p.PaymentMethod,
		&p.ProviderPaymentID,
		&p.ExternalReference,
		&p.Status,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &p, nil
}

func (r *paymentRepository) GetByBookingID(bookingID string) (*domain.Payment, error) {
	row := r.db.QueryRow(`
		SELECT id, booking_id, user_id, amount, currency,
		       payment_method, provider_payment_id,
		       external_reference, status, created_at, updated_at
		FROM payment
		WHERE booking_id = $1
	`, bookingID)

	var p domain.Payment

	err := row.Scan(
		&p.Id,
		&p.BookingID,
		&p.UserID,
		&p.Amount,
		&p.Currency,
		&p.PaymentMethod,
		&p.ProviderPaymentID,
		&p.ExternalReference,
		&p.Status,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &p, nil
}

func (r *paymentRepository) UpdateStatus(id string, status string) error {
	result, err := r.db.Exec(`
		UPDATE payment
		SET status = $1,
		    updated_at = NOW()
		WHERE id = $2
	`, status, id)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("payment not found")
	}

	return nil
}
