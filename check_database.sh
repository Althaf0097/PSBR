#!/bin/bash

# Database connection details
DB_NAME="tododb"
DB_USER="postgres"
DB_PASSWORD="postgres@123"
DB_HOST="localhost"

echo "=========================================="
echo "  Todo Application - Database Check"
echo "=========================================="
echo ""

echo "=== Tables in Database ==="
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "\dt"
echo ""

echo "=== Users ==="
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;"
echo ""

echo "=== Todos ==="
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT id, title, completed, priority, due_date, created_at FROM todos ORDER BY created_at DESC LIMIT 10;"
echo ""

echo "=== Statistics ==="
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT COUNT(*) as total_users FROM users;"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT COUNT(*) as total_todos FROM todos;"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT completed, COUNT(*) as count FROM todos GROUP BY completed;"
echo ""

echo "=== Todos with User Info ==="
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT t.title, t.completed, t.priority, u.username FROM todos t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC;"
echo ""

echo "=========================================="

