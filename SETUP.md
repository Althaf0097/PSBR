# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Maven installed (`mvn -version`)
- ✅ Node.js 18+ installed (`node -v`)
- ✅ PostgreSQL installed and running (`psql --version`)

## Step-by-Step Setup

### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE tododb;

# Exit psql
\q
```

### 2. Backend Setup

```bash
cd backend

# Set environment variables (optional, defaults are in application.yml)
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=your-secret-key-minimum-256-bits-required-for-hmac-sha256

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## First Run

1. Open `http://localhost:5173` in your browser
2. Click "Register" to create an account
3. After registration, you'll be automatically logged in
4. Start creating todos!

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database exists: `psql -U postgres -l | grep tododb`
- Check port 8080 is free: `lsof -i :8080`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

### Database migration errors
- Ensure Flyway has permission to create tables
- Check database user has CREATE TABLE privileges
- Review migration files in `backend/src/main/resources/db/migration/`

## Production Deployment Notes

1. **Change JWT_SECRET** to a strong, random secret (minimum 256 bits)
2. **Update database credentials** in `application.yml` or use environment variables
3. **Set CORS origins** in `SecurityConfig.java` to your production domain
4. **Build frontend**: `npm run build` and serve the `dist` folder
5. **Use production profile**: `mvn spring-boot:run -Dspring-boot.run.profiles=prod`


