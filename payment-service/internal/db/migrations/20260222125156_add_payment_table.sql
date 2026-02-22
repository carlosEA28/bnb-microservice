-- +goose Up
-- +goose StatementBegin

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'APPROVED',
    'REJECTED',
    'CANCELED',
    'REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
    'PIX',
    'CREDIT_CARD',
    'BOLETO'
);

CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    booking_id UUID NOT NULL,
    user_id UUID NOT NULL,

    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL,

    payment_method payment_method NOT NULL,
    provider_payment_id VARCHAR(255),
    external_reference VARCHAR(255) NOT NULL,

    status payment_status NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_booking_id ON payment(booking_id);
CREATE INDEX idx_payment_user_id ON payment(user_id);
CREATE INDEX idx_payment_status ON payment(status);

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS payment;

DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS payment_method;

-- +goose StatementEnd