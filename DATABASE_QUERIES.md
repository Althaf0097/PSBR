# Database Query Guide

This guide shows you how to check and query the PostgreSQL database for the Todo application.

## Connection Information

- **Database Name**: `tododb`
- **Username**: `postgres`
- **Password**: `postgres@123`
- **Host**: `localhost`
- **Port**: `5432`

## Quick Connection

### Method 1: Using psql with password
```bash
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb
```

### Method 2: Interactive connection (will prompt for password)
```bash
psql -U postgres -h localhost -d tododb
```

### Method 3: One-line queries
```bash
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb -c "YOUR_QUERY_HERE"
```

## Common Queries

### 1. List All Tables
```sql
\dt
```
Or:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 2. View Users Table Structure
```sql
\d users
```

### 3. View Todos Table Structure
```sql
\d todos
```

### 4. Check All Users
```sql
SELECT id, username, email, created_at 
FROM users 
ORDER BY created_at DESC;
```

### 5. Count Users
```sql
SELECT COUNT(*) as total_users FROM users;
```

### 6. Check All Todos
```sql
SELECT 
    id, 
    title, 
    completed, 
    priority, 
    due_date, 
    created_at,
    user_id
FROM todos 
ORDER BY created_at DESC;
```

### 7. Check Todos for a Specific User
```sql
-- First, get user ID
SELECT id, username FROM users WHERE username = 'testuser';

-- Then get their todos (replace USER_ID with actual ID)
SELECT 
    id, 
    title, 
    description,
    completed, 
    priority, 
    due_date,
    created_at
FROM todos 
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC;
```

### 8. Count Todos by Status
```sql
SELECT 
    completed,
    COUNT(*) as count
FROM todos
GROUP BY completed;
```

### 9. Count Todos by Priority
```sql
SELECT 
    priority,
    COUNT(*) as count
FROM todos
GROUP BY priority
ORDER BY 
    CASE priority
        WHEN 'HIGH' THEN 1
        WHEN 'MEDIUM' THEN 2
        WHEN 'LOW' THEN 3
    END;
```

### 10. Find Overdue Todos
```sql
SELECT 
    t.id,
    t.title,
    t.due_date,
    t.completed,
    u.username
FROM todos t
JOIN users u ON t.user_id = u.id
WHERE t.due_date < CURRENT_DATE 
  AND t.completed = false
ORDER BY t.due_date ASC;
```

### 11. Get Todos with User Information (JOIN)
```sql
SELECT 
    t.id,
    t.title,
    t.completed,
    t.priority,
    t.due_date,
    u.username,
    u.email
FROM todos t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC;
```

### 12. Check Recent Activity
```sql
-- Recent users
SELECT username, email, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- Recent todos
SELECT title, completed, priority, created_at 
FROM todos 
ORDER BY created_at DESC 
LIMIT 10;
```

### 13. Delete Test Data (if needed)
```sql
-- Delete a specific todo
DELETE FROM todos WHERE id = 'TODO_ID_HERE';

-- Delete all todos for a user
DELETE FROM todos WHERE user_id = 'USER_ID_HERE';

-- Delete a user (will cascade delete their todos)
DELETE FROM users WHERE id = 'USER_ID_HERE';
```

### 14. Check Flyway Migration History
```sql
SELECT 
    installed_rank,
    version,
    description,
    type,
    installed_on,
    success
FROM flyway_schema_history
ORDER BY installed_rank;
```

## Useful psql Commands

Once connected to psql, you can use these commands:

- `\q` - Quit psql
- `\dt` - List all tables
- `\d table_name` - Describe a table structure
- `\du` - List all users/roles
- `\l` - List all databases
- `\c database_name` - Connect to a different database
- `\x` - Toggle expanded display (useful for wide tables)
- `\timing` - Toggle query execution time display

## Example Session

```bash
# Connect to database
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb

# Inside psql:
tododb=# \dt                    # List tables
tododb=# SELECT * FROM users;   # View all users
tododb=# SELECT COUNT(*) FROM todos;  # Count todos
tododb=# \q                     # Exit
```

## Quick Check Script

You can create a simple script to quickly check the database:

```bash
#!/bin/bash
echo "=== Users ==="
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb -c "SELECT id, username, email, created_at FROM users;"

echo ""
echo "=== Todos ==="
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb -c "SELECT id, title, completed, priority, due_date FROM todos LIMIT 10;"

echo ""
echo "=== Statistics ==="
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb -c "SELECT COUNT(*) as total_users FROM users;"
PGPASSWORD=postgres@123 psql -U postgres -h localhost -d tododb -c "SELECT COUNT(*) as total_todos FROM todos;"
```

Save this as `check_db.sh`, make it executable (`chmod +x check_db.sh`), and run it.

