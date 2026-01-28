# Mini CRM Backend - Prysm Labs Assignment

## 🎯 Assignment Overview

Backend Developer Intern assignment implementing a mini CRM system with user authentication, customer management, and task tracking using **Node.js**, **PostgreSQL**, and **Prisma ORM**.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify (high-performance HTTP framework)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Features

### ✅ Implemented Modules

1. **Authentication Module**
   - User registration with role assignment (ADMIN/EMPLOYEE)
   - JWT-based login system
   - Password hashing with bcrypt
   - Secure token-based authentication

2. **Users Module** (Admin Only)
   - View all users
   - Get user by ID
   - Update user roles

3. **Customers Module**
   - Full CRUD operations
   - Pagination support
   - Search functionality (name, email, phone, company)
   - Unique constraints on email and phone
   - Role-based access control

4. **Tasks Module**
   - Create tasks assigned to employees
   - Link tasks to customers
   - Status tracking (PENDING, IN_PROGRESS, DONE)
   - Role-based task visibility

## 📁 Project Structure

```
pycharms/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── customer.controller.ts
│   │   └── task.controller.ts
│   ├── services/              # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── customer.service.ts
│   │   └── task.service.ts
│   ├── routes/                # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── customer.routes.ts
│   │   └── task.routes.ts
│   ├── middleware/            # Authentication & validation
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── validation.middleware.ts
│   ├── dtos/                  # Data Transfer Objects
│   │   ├── auth.dto.ts
│   │   ├── user.dto.ts
│   │   ├── customer.dto.ts
│   │   └── task.dto.ts
│   └── utils/                 # Utility functions
│       ├── prisma.ts          # Prisma client
│       ├── jwt.ts             # JWT utilities
│       └── password.ts        # Password hashing
├── server.ts                  # Application entry point
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd pycharms

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/mini_crm?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="*"

# Logging
LOG_LEVEL=info
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Optional: Open Prisma Studio (database GUI)
npm run prisma:studio
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### 🔐 Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

#### 👥 Users (Admin Only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user role

#### 👤 Customers
- `POST /customers` - Create customer (Admin only)
- `GET /customers` - Get all customers with pagination (Admin + Employee)
- `GET /customers/:id` - Get customer by ID (Admin + Employee)
- `PATCH /customers/:id` - Update customer (Admin only)
- `DELETE /customers/:id` - Delete customer (Admin only)

#### 📝 Tasks
- `POST /tasks` - Create task (Admin only)
- `GET /tasks` - Get tasks (Admin: all, Employee: assigned only)
- `PATCH /tasks/:id/status` - Update task status

## 🧪 Testing the API

### Using Swagger UI

1. Go to `http://localhost:3000/api-docs`
2. Click "Authorize" button
3. Enter your JWT token
4. Test endpoints directly from the UI

### Using cURL

```bash
# Register a new admin user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ADMIN"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Get all customers (with token)
curl -X GET http://localhost:3000/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Database Schema

### User Model
- id (String, Primary Key)
- name (String)
- email (String, Unique)
- password (String, bcrypt hashed)
- role (Enum: ADMIN, EMPLOYEE)
- createdAt, updatedAt (DateTime)

### Customer Model
- id (String, Primary Key)
- name (String)
- email (String, Unique)
- phone (String, Unique)
- company (String, Optional)
- createdAt, updatedAt (DateTime)

### Task Model
- id (String, Primary Key)
- title (String)
- description (String, Optional)
- status (Enum: PENDING, IN_PROGRESS, DONE)
- assignedToId (Foreign Key → User)
- customerId (Foreign Key → Customer)
- createdAt, updatedAt (DateTime)

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT-based authentication
- ✅ Role-based authorization (ADMIN/EMPLOYEE)
- ✅ Input validation with Zod
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Proper error handling
- ✅ SQL injection protection (Prisma)

## 🎓 Key Features Implemented

### ✅ Clean Architecture
- Separation of concerns (controllers, services, routes)
- Middleware for authentication and validation
- DTOs for request validation
- Utility functions for reusable logic

### ✅ Validation & Error Handling
- Zod schema validation
- Proper HTTP status codes
- Descriptive error messages
- Unique constraint handling (409 Conflict)
- Not found handling (404)
- Authorization errors (403 Forbidden)

### ✅ Role-Based Access Control
- Admin: Full access to all endpoints
- Employee: Read-only for customers, can view/update assigned tasks only

### ✅ Pagination & Filtering
- Customers endpoint supports pagination (page, limit)
- Search functionality across multiple fields
- Total records and pages metadata

### ✅ Bonus Features
- ✅ Customer search filter
- ✅ Docker support (docker-compose.yml)
- ✅ Comprehensive API documentation
- ✅ Clean Git history

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:reset     # Reset database
```

## 🐳 Docker Support

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

## 📝 Assignment Checklist

- ✅ NestJS/Node.js with TypeScript
- ✅ PostgreSQL database
- ✅ Prisma ORM
- ✅ JWT Authentication
- ✅ Swagger API documentation
- ✅ DTO validation (Zod)
- ✅ bcrypt password hashing
- ✅ Clean architecture
- ✅ All required endpoints
- ✅ Role-based authorization
- ✅ Pagination support
- ✅ Error handling
- ✅ README with setup instructions
- ✅ .env.example file
- ✅ Bonus: Search filter
- ✅ Bonus: Docker support

## 🚀 Deployment

The API is production-ready and can be deployed to:
- Railway
- Render
- Heroku
- AWS/Azure/GCP
- Any Node.js hosting platform

## 👨‍💻 Author

**Prysm Labs - Backend Developer Intern Assignment**

## 📄 License

ISC
