# Connecting to Database in pgAdmin

## Connection Details

Use these details to connect to your Todo application database in pgAdmin:

### Server Connection Information

- **Name**: Todo Application DB (or any name you prefer)
- **Host name/address**: `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres` (or `tododb`)
- **Username**: `postgres`
- **Password**: `postgres@123`

### Database Details

- **Database Name**: `tododb`

---

## Step-by-Step Connection Guide

### Step 1: Open pgAdmin

1. Launch pgAdmin 4 (or pgAdmin 3 if you have the older version)
2. You'll see the pgAdmin interface with a server tree on the left

### Step 2: Add New Server

1. **Right-click** on "Servers" in the left panel
2. Select **"Register" → "Server..."** (or "Create" → "Server..." in pgAdmin 4)

### Step 3: General Tab

- **Name**: Enter a friendly name like "Todo Application" or "Local PostgreSQL"

### Step 4: Connection Tab

Fill in the connection details:

- **Host name/address**: `localhost`
- **Port**: `5432`
- **Maintenance database**: `postgres`
- **Username**: `postgres`
- **Password**: `postgres@123`
- **Save password**: ✓ (check this box to save the password)

### Step 5: Advanced Tab (Optional)

- **DB restriction**: You can leave empty or enter `tododb` to show only this database

### Step 6: Save

Click **"Save"** button

---

## After Connecting

Once connected, you can:

1. **Expand the server** in the left panel
2. **Expand "Databases"**
3. **Find and expand "tododb"**
4. **Expand "Schemas" → "public"**
5. **View tables**: `users`, `todos`, `flyway_schema_history`

### Viewing Data

1. Right-click on a table (e.g., `users`)
2. Select **"View/Edit Data" → "All Rows"**
3. You'll see all the data in a spreadsheet-like view

### Running Queries

1. Click on **"Query Tool"** icon (or right-click database → "Query Tool")
2. Type your SQL query:
   ```sql
   SELECT * FROM users;
   SELECT * FROM todos;
   ```
3. Click **"Execute"** (F5) to run the query

---

## Troubleshooting

### Connection Refused
- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Check if PostgreSQL is listening on port 5432

### Authentication Failed
- Verify the password is correct: `postgres@123`
- Check if the user `postgres` exists and has proper permissions

### Cannot Find Database
- The database `tododb` should exist
- If not, create it: `CREATE DATABASE tododb;`

---

## Quick Test Query

Once connected, try these queries in the Query Tool:

```sql
-- View all users
SELECT id, username, email, created_at FROM users;

-- View all todos
SELECT id, title, completed, priority, due_date, created_at FROM todos;

-- View todos with user information
SELECT 
    t.id,
    t.title,
    t.completed,
    t.priority,
    u.username,
    u.email
FROM todos t
JOIN users u ON t.user_id = u.id;
```

---

## pgAdmin Installation (if not installed)

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install pgadmin4
```

### Using Snap:
```bash
sudo snap install pgadmin4
```

### macOS:
```bash
brew install --cask pgadmin4
```

### Windows:
Download from: https://www.pgadmin.org/download/

---

## Alternative: Using DBeaver (Another GUI Tool)

If you prefer DBeaver:

1. Download from: https://dbeaver.io/download/
2. Create new connection → PostgreSQL
3. Use the same connection details above

