# Build stage
FROM golang:1.25.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o payment-service ./cmd/app

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/payment-service .

EXPOSE 3003

CMD ["./payment-service"]
