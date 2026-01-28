# Setup Local PostgreSQL Database

## Option 1: Using Docker (Easiest)

```bash
# Start PostgreSQL with Docker
docker run --name mini-crm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mini_crm -p 5432:5432 -d postgres:15

# Update .env DATABASE_URL to:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_crm?schema=public"

# Run migrations
npm run prisma:migrate

# Restart server
npm run dev
```

## Option 2: Install PostgreSQL Directly

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (default settings)
3. Set password as `postgres`
4. Update `.env` DATABASE_URL to:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_crm?schema=public"
   ```
5. Run: `npm run prisma:migrate`
6. Run: `npm run dev`

## Option 3: Reconnect to Prisma Cloud

1. Check your internet connection
2. Verify Prisma Cloud status: https://status.prisma.io/
3. Try restarting the server
4. If still failing, create a new Prisma Cloud database at: https://cloud.prisma.io/

## Quick Test - Restart Server

Sometimes the connection just needs a retry:

```bash
npm run dev
```

If you see "Database connected successfully", the issue is resolved!
