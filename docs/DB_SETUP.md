# Database Setup

## 1. Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE myapp;
CREATE USER myapp_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;
ALTER DATABASE myapp OWNER TO myapp_user;

# Exit psql
\q
```

## 2. Configure Environment

Add to `.env.local`:

```bash
DATABASE_URL=postgresql://myapp_user:your-secure-password@localhost:5432/myapp
```

### Optional settings (uncomment and adjust as needed):

```bash
# SSL: "require" (default in production), "prefer", or "false" (default in dev)
# DATABASE_SSL=false

# Max connections: default 10 in production, 1 in development
# DATABASE_MAX_CONNECTIONS=10

# Set to "false" if using PgBouncer, RDS Proxy, or Supabase pooler
# DATABASE_PREPARE=true
```

## 3. Apply Schema

```bash
# Development (applies schema directly, no migration files)
npm run db:push

# Production (generates and applies migration files)
npm run db:generate
npm run db:migrate
```

## 4. Seed Sample Data

```bash
npm run db:seed
```

This creates 3 users (admin, regular, paid), profiles, Stripe products/prices, and a sample subscription. Safe to run multiple times.

## 5. Verify

```bash
# Open Drizzle Studio to browse tables
npm run db:studio
```

Or verify via psql:

```bash
psql -U myapp_user -d myapp -c "SELECT id, email, name FROM \"user\";"
```

## Remote Database (VPS / AWS RDS)

```bash
# .env.local for remote PostgreSQL
DATABASE_URL=postgresql://myapp_user:your-secure-password@your-server-ip:5432/myapp
DATABASE_SSL=require
```

Then run the same steps 3-5 above.

## All Commands (Quick Reference)

```bash
# Full setup in order:
npm run db:push          # Apply schema
npm run db:seed          # Seed sample data
npm run db:studio        # Browse data (optional)

# Other useful commands:
npm run db:generate      # Generate SQL migration files
npm run db:migrate       # Apply pending migrations
```
