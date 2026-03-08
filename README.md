# Simple Airbnb

Sistema de aluguel de imóveis construído com arquitetura de microserviços.

## Arquitetura

```
                         ┌──────────────┐
                         │    Client    │
                         └──────┬───────┘
                                │
                         ┌──────┴───────┐
                         │     Kong     │
                         │  (Gateway)   │
                         │    :8000     │
                         └──────┬───────┘
                                │
       ┌────────────┬───────────┼───────────┬────────────┐
       │            │           │           │            │
┌──────┴──────┐ ┌───┴────┐ ┌────┴────┐ ┌────┴────┐ ┌─────┴─────┐
│    Auth     │ │Property│ │ Booking │ │ Payment │ │ Webhooks  │
│   :3000     │ │ :3001  │ │  :3002  │ │  :3003  │ │   :3004   │
└──────┬──────┘ └───┬────┘ └────┬────┘ └────┬────┘ └───────────┘
       │            │           │           │
       └────────────┴─────┬─────┴───────────┘
                          │
                    ┌─────┴─────┐
                    │ RabbitMQ  │
                    └───────────┘
```

## Serviços

| Serviço          | Stack             | Porta |
| ---------------- | ----------------- | ----- |
| Kong Gateway     | Kong              | 8000  |
| Auth Service     | Node.js + Express | 3000  |
| Property Service | Node.js + Express | 3001  |
| Booking Service  | Node.js + Express | 3002  |
| Payment Service  | Go + Chi          | 3003  |
| Webhooks Service | Node.js + Express | 3004  |

## Tecnologias

- **Node.js / Go** - Backend
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM (Node.js)
- **RabbitMQ** - Mensageria
- **Kong** - API Gateway com JWT
- **AWS Cognito** - Autenticação
- **AWS S3** - Storage de imagens
- **Mercado Pago** - Pagamentos

## Endpoints

### Auth Service (`/users`)

| Método | Rota            | Descrição       |
| ------ | --------------- | --------------- |
| POST   | /users          | Criar usuário   |
| DELETE | /users/:id      | Deletar usuário |
| POST   | /users/sessions | Login           |
| DELETE | /users/sessions | Logout          |

### Property Service (`/properties`)

| Método | Rota                       | Descrição                 |
| ------ | -------------------------- | ------------------------- |
| POST   | /properties                | Criar propriedade         |
| GET    | /properties                | Listar todas              |
| GET    | /properties/available      | Listar disponíveis        |
| GET    | /properties/search/city    | Buscar por cidade         |
| GET    | /properties/search/country | Buscar por país           |
| GET    | /properties/search/price   | Buscar por faixa de preço |
| PUT    | /properties/:id            | Editar propriedade        |
| PATCH  | /properties/:id/price      | Atualizar preço           |
| DELETE | /properties/:id            | Deletar propriedade       |

### Booking Service (`/bookings`)

| Método | Rota                           | Descrição              |
| ------ | ------------------------------ | ---------------------- |
| POST   | /bookings                      | Criar reserva          |
| GET    | /bookings                      | Listar todas           |
| GET    | /bookings/:id                  | Buscar por ID          |
| GET    | /bookings/guest/:guestId       | Buscar por hóspede     |
| GET    | /bookings/property/:propertyId | Buscar por propriedade |
| PATCH  | /bookings/:id/cancel           | Cancelar reserva       |
| PATCH  | /bookings/:id/confirm          | Confirmar reserva      |

### Payment Service (`/payments`)

| Método | Rota          | Descrição        |
| ------ | ------------- | ---------------- |
| POST   | /payments     | Criar pagamento  |
| GET    | /payments/:id | Buscar pagamento |

### Webhooks Service (`/webhooks`)

| Método | Rota             | Descrição      |
| ------ | ---------------- | -------------- |
| POST   | /webhooks/stripe | Webhook Stripe |

## Executar

```bash
# Subir Kong e RabbitMQ
docker-compose up -d

# Em cada serviço
cd services/<service-name>
npm install
npm run dev
```

## Variáveis de Ambiente

Exemplo `.env` para auth-service:

```env
DATABASE_URL=
AWS_REGION=
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
COGNITO_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
