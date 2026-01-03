# Todo Web Application

A production-ready, full-stack Todo application built with React (frontend), Spring Boot (backend), and PostgreSQL (database).

## Features

### User Features
- ✅ User registration & login (JWT-based authentication)
- ✅ Create, read, update, delete todos
- ✅ Mark todos as completed / pending
- ✅ Due date & priority support (LOW, MEDIUM, HIGH)
- ✅ Filter todos (all / completed / pending)
- ✅ Sort by due date, priority, title, or creation date
- ✅ Responsive UI (desktop & mobile)
- ✅ Data persistence per user

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Context API for state management
- Tailwind CSS
- Form validation

### Backend
- Java 17+
- Spring Boot 4.0.1
- Spring Data JPA
- Spring Security
- JWT authentication
- PostgreSQL
- Flyway for database migrations
- Bean validation
- DTO pattern

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- PostgreSQL 12+

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE tododb;
```

Update database credentials in `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tododb
    username: your_username
    password: your_password
```

Or set environment variables:
```bash
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Update JWT secret in `application.yml` or set environment variable:

```bash
export JWT_SECRET=your-secret-key-minimum-256-bits-required-for-hmac-sha256
```

Build and run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update `.env` if needed:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos

- `POST /api/todos` - Create a new todo
- `GET /api/todos` - Get all todos (with pagination, filtering, sorting)
- `GET /api/todos/{id}` - Get a todo by ID
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo
- `PATCH /api/todos/{id}/toggle` - Toggle todo completion status

### Query Parameters for GET /api/todos

- `page` - Page number (default: 0)
- `size` - Page size (default: 10)
- `sortBy` - Sort field (createdAt, dueDate, priority, title)
- `sortDir` - Sort direction (asc, desc)
- `completed` - Filter by completion status (true, false)

## Project Structure

### Backend

```
backend/
├── src/main/java/com/example/todo/
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── TodoController.java
│   ├── dto/
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── TodoRequest.java
│   │   └── TodoResponse.java
│   ├── entity/
│   │   ├── Todo.java
│   │   └── User.java
│   ├── exception/
│   │   ├── ErrorResponse.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceAlreadyExistsException.java
│   │   ├── ResourceNotFoundException.java
│   │   └── UnauthorizedException.java
│   ├── repository/
│   │   ├── TodoRepository.java
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── CustomUserDetailsService.java
│   │   ├── JwtFilter.java
│   │   └── JwtUtil.java
│   ├── service/
│   │   ├── AuthService.java
│   │   └── TodoService.java
│   └── TodoApplication.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
│       ├── V1__create_users_table.sql
│       └── V2__create_todos_table.sql
└── pom.xml
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.js
│   │   └── todos.js
│   ├── components/
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Todos.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `username` (VARCHAR(50), Unique)
- `email` (VARCHAR(100), Unique)
- `password` (VARCHAR(255))
- `created_at` (TIMESTAMP)

### Todos Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR(200))
- `description` (VARCHAR(1000))
- `completed` (BOOLEAN)
- `priority` (VARCHAR(20)) - LOW, MEDIUM, HIGH
- `due_date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `user_id` (UUID, Foreign Key)

## Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Protected API endpoints
- CORS configuration
- Input validation
- SQL injection prevention (JPA)
- XSS protection

## Development

### Running in Development Mode

Backend:
```bash
cd backend
mvn spring-boot:run
```

Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Frontend:
```bash
cd frontend
npm run build
```

## Environment Variables

### Backend

- `DB_USERNAME` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: postgres)
- `JWT_SECRET` - JWT secret key (minimum 256 bits)
- `JWT_EXPIRATION` - JWT expiration in milliseconds (default: 86400000 = 24 hours)

### Frontend

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:8080/api)

## Testing the Application

1. Start PostgreSQL and create the database
2. Start the backend server
3. Start the frontend development server
4. Navigate to `http://localhost:5173`
5. Register a new account
6. Create, update, and manage your todos!

## Troubleshooting

### Backend Issues

- **Port 8080 already in use**: Change the port in `application.yml` or stop the conflicting service
- **Database connection error**: Verify PostgreSQL is running and credentials are correct
- **JWT errors**: Ensure JWT_SECRET is set and is at least 256 bits

### Frontend Issues

- **API connection errors**: Verify backend is running and `VITE_API_BASE_URL` is correct
- **CORS errors**: Check backend CORS configuration in `SecurityConfig.java`
- **Build errors**: Run `npm install` to ensure all dependencies are installed

## License

This project is open source and available for educational purposes.


