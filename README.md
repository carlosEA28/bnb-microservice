# Simple Airbnb

Sistema de aluguel de imóveis simplificado, inspirado no Airbnb, construído com arquitetura de microserviços.

## 🏗️ Arquitetura

```
                              ┌─────────────┐
                              │   Client    │
                              │  (Browser/  │
                              │   Mobile)   │
                              └──────┬──────┘
                                     │
                              ┌──────┴──────┐
                              │    Kong     │
                              │ API Gateway │
                              │   (:8000)   │
                              └──────┬──────┘
                                     │
       ┌───────────────────┬─────────┴─────────┬───────────────────┐
       │                   │                   │                   │
┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
│   Auth      │     │  Property   │     │   Booking   │     │   Payment   │
│  Service    │     │  Service    │     │   Service   │     │   Service   │
│  (Node.js)  │     │  (Node.js)  │     │  (Node.js)  │     │    (Go)     │
│   :3000     │     │   :3001     │     │   :3002     │     │   :3003     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       └───────────────────┴─────────┬─────────┴───────────────────┘
                                     │
                              ┌──────┴──────┐
                              │  RabbitMQ   │
                              │  (Message   │
                              │   Broker)   │
                              └─────────────┘
                                     │
       ┌───────────────────┬─────────┴─────────┬───────────────────┐
       │                   │                   │                   │
┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
│ PostgreSQL  │     │ PostgreSQL  │     │ PostgreSQL  │     │ PostgreSQL  │
│  (Auth DB)  │     │(Property DB)│     │(Booking DB) │     │(Payment DB) │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## 📦 Microserviços

| Serviço              | Tecnologia        | Descrição                                                      | Porta |
| -------------------- | ----------------- | -------------------------------------------------------------- | ----- |
| **Kong Gateway**     | Kong              | API Gateway - ponto de entrada único para todas as requisições | 8000  |
| **Auth Service**     | Node.js + Express | Autenticação e gerenciamento de usuários via AWS Cognito       | 3000  |
| **Property Service** | Node.js + Express | Cadastro e busca de propriedades para aluguel                  | 3001  |
| **Booking Service**  | Node.js + Express | Gerenciamento de reservas                                      | 3002  |
| **Payment Service**  | Go + Chi          | Processamento de pagamentos                                    | 3003  |

## 🚀 Tech Stack

### Backend

- **Node.js** - Runtime JavaScript para Auth, Property e Booking Services
- **Go** - Linguagem compilada para Payment Service (alta performance)
- **Express** - Framework web para Node.js
- **Chi** - Router HTTP leve e idiomático para Go

### Banco de Dados

- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM para serviços Node.js

### Mensageria

- **RabbitMQ** - Message broker para comunicação assíncrona entre serviços

### API Gateway

- **Kong** - API Gateway para roteamento, rate limiting, autenticação e monitoramento

### Cloud & Infraestrutura

- **Docker** - Containerização
- **AWS Cognito** - Autenticação de usuários
- **AWS S3** - Armazenamento de imagens

### Validação

- **Zod** - Validação de schemas em TypeScript

## 📁 Estrutura do Projeto

```
simple-airbnb/
├── auth-service/        # Serviço de autenticação (Node.js)
├── property-service/    # Serviço de propriedades (Node.js)
├── booking-service/     # Serviço de reservas (Node.js)
├── payment-service/     # Serviço de pagamentos (Go)
├── kong/                # Configuração do Kong API Gateway
│   └── kong.yml         # Declarative config (services, routes, plugins)
└── docker-compose.yml   # Orquestração dos containers
```

### Rotas Configuradas

| Rota Externa        | Serviço          | Rota Interna |
| ------------------- | ---------------- | ------------ |
| `/api/auth/*`       | Auth Service     | `/*`         |
| `/api/properties/*` | Property Service | `/*`         |
| `/api/bookings/*`   | Booking Service  | `/*`         |
| `/api/payments/*`   | Payment Service  | `/*`         |

### Admin API

O Kong Admin API está disponível na porta `8001` para configuração e monitoramento.

## ⚙️ Configuração

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+
- Go 1.21+
- Conta AWS (Cognito e S3)

### Variáveis de Ambiente

Cada serviço possui seu próprio arquivo `.env`. Consulte o README de cada serviço para mais detalhes.

## Comunicação entre Serviços

Os serviços se comunicam através do **RabbitMQ** usando o padrão de mensageria:

### Eventos Publicados

| Serviço  | Evento              | Descrição                   |
| -------- | ------------------- | --------------------------- |
| Auth     | `user.created`      | Novo usuário registrado     |
| Auth     | `user.deleted`      | Usuário removido            |
| Property | `property.created`  | Nova propriedade cadastrada |
| Property | `property.updated`  | Propriedade atualizada      |
| Booking  | `booking.created`   | Nova reserva criada         |
| Booking  | `booking.cancelled` | Reserva cancelada           |
| Payment  | `payment.completed` | Pagamento confirmado        |
| Payment  | `payment.failed`    | Pagamento falhou            |

## 🔗 API Endpoints

> **Nota:** Todas as requisições passam pelo Kong Gateway na porta `8000`. As rotas abaixo mostram os endpoints internos de cada serviço. Via Kong, use o prefixo correspondente (ex: `/api/auth/users` para criar usuário).

### Auth Service (`:3000` | Kong: `/api/auth`)

| Método | Rota         | Descrição       |
| ------ | ------------ | --------------- |
| POST   | `/users`     | Criar usuário   |
| DELETE | `/users/:id` | Deletar usuário |
| POST   | `/sessions`  | Login           |
| DELETE | `/sessions`  | Logout          |

### Property Service (`:3001` | Kong: `/api/properties`)

| Método | Rota              | Descrição             |
| ------ | ----------------- | --------------------- |
| GET    | `/properties`     | Listar propriedades   |
| GET    | `/properties/:id` | Buscar propriedade    |
| POST   | `/properties`     | Criar propriedade     |
| PUT    | `/properties/:id` | Atualizar propriedade |
| DELETE | `/properties/:id` | Deletar propriedade   |

### Booking Service (`:3002` | Kong: `/api/bookings`)

| Método | Rota                   | Descrição        |
| ------ | ---------------------- | ---------------- |
| GET    | `/bookings`            | Listar reservas  |
| GET    | `/bookings/:id`        | Buscar reserva   |
| POST   | `/bookings`            | Criar reserva    |
| PATCH  | `/bookings/:id/cancel` | Cancelar reserva |

### Payment Service (`:3003` | Kong: `/api/payments`)

| Método | Rota                   | Descrição           |
| ------ | ---------------------- | ------------------- |
| POST   | `/payments`            | Processar pagamento |
| GET    | `/payments/:id`        | Buscar pagamento    |
| POST   | `/payments/:id/refund` | Solicitar reembolso |

## 📄 Licença

ISC

---

Desenvolvido com ❤️ como projeto de estudo de arquitetura de microserviços.
