# Auth Service

Microserviço de autenticação para a aplicação Simple Airbnb. Responsável pelo gerenciamento de usuários e sessões utilizando AWS Cognito.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM para PostgreSQL
- **AWS Cognito** - Autenticação e gerenciamento de usuários
- **AWS S3** - Armazenamento de imagens de perfil
- **Zod** - Validação de schemas
- **Docker** - Containerização do banco de dados

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Conta AWS com Cognito e S3 configurados

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_db"
PORT=3000

# AWS
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"

# Cognito
COGNITO_USER_POOL_ID="seu_user_pool_id"
COGNITO_CLIENT_ID="seu_client_id"
COGNITO_SECRET="seu_client_secret"
```

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Subir o banco de dados
docker-compose up -d

# Rodar migrations do Prisma
npx prisma migrate dev

# Iniciar servidor em modo desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── dtos/              # Data Transfer Objects
├── env/               # Configuração de variáveis de ambiente
├── generated/         # Código gerado pelo Prisma
├── http/
│   ├── controller/    # Controllers das rotas
│   ├── middlewares/   # Middlewares (Multer para upload)
│   └── routes.ts      # Definição das rotas
├── lib/
│   ├── prisma.ts      # Cliente Prisma
│   └── aws/           # Clientes e serviços AWS
├── repositories/      # Camada de acesso a dados
├── use-cases/         # Casos de uso da aplicação
│   ├── factories/     # Factories para injeção de dependências
│   └── errors/        # Erros customizados
└── utils/             # Funções utilitárias
```

## 🔗 Endpoints da API

### Usuários

| Método | Rota          | Descrição                     |
|--------|---------------|-------------------------------|
| POST   | `/users`      | Criar novo usuário            |
| DELETE | `/users/:id`  | Deletar usuário               |

### Sessões

| Método | Rota          | Descrição                     |
|--------|---------------|-------------------------------|
| POST   | `/sessions`   | Login (autenticação)          |
| DELETE | `/sessions`   | Logout                        |

## 📊 Modelo de Dados

### User

| Campo      | Tipo     | Descrição                     |
|------------|----------|-------------------------------|
| id         | UUID     | Identificador único           |
| cognitoId  | String   | ID do usuário no Cognito      |
| name       | String   | Nome do usuário               |
| email      | String   | Email (único)                 |
| imageUrl   | String?  | URL da imagem de perfil no S3 |
| role       | Enum     | `HOST` ou `GUEST`             |
| createdAt  | DateTime | Data de criação               |
| updatedAt  | DateTime | Data de atualização           |

## 🐳 Docker

O projeto utiliza Docker Compose para o banco de dados PostgreSQL:

```bash
# Iniciar container
docker-compose up -d

# Parar container
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📝 Scripts Disponíveis

| Script      | Descrição                           |
|-------------|-------------------------------------|
| `npm run dev` | Inicia o servidor em modo watch   |

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas com separação de responsabilidades:

1. **Controllers** - Recebem requisições HTTP e retornam respostas
2. **Use Cases** - Contêm a lógica de negócio
3. **Repositories** - Abstraem o acesso ao banco de dados
4. **Services** - Integração com serviços externos (AWS)

## 📄 Licença

ISC
