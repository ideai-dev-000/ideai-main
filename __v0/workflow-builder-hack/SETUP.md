# Local Development Setup Guide

This guide will help you set up the workflow builder for local development with a local PostgreSQL database, and show you how to switch to a cloud database when needed.

## Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL (local or cloud)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Local PostgreSQL Database

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name workflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=workflow_builder \
  -p 5432:5432 \
  -d postgres:16

# Verify it's running
docker ps
```

### Option B: Install PostgreSQL Locally

**macOS (using Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb workflow_builder
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb workflow_builder
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database Configuration
# Option 1: Use DATABASE_URL for explicit control (highest priority)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder

# Option 2: Use separate URLs and toggle with USE_CLOUD_DB
DATABASE_LOCAL_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder
DATABASE_CLOUD_URL=postgresql://user:password@your-cloud-db.com:5432/workflow_builder
USE_CLOUD_DB=false  # Set to "true" to use DATABASE_CLOUD_URL

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3888
NEXT_PUBLIC_APP_URL=http://localhost:3888

# Integration Encryption (required for saving API credentials)
# Generate with: openssl rand -hex 32
INTEGRATION_ENCRYPTION_KEY=your-64-character-hex-key-here

# AI Gateway (for AI workflow generation)
AI_GATEWAY_API_KEY=your-ai-gateway-api-key
AI_MODEL=openai/gpt-5.1-instant
```

### Generate BETTER_AUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 4: Run Database Migrations

```bash
# Push schema to database (creates all tables)
pnpm db:push

# Or generate and run migrations manually
pnpm db:generate
pnpm db:migrate
```

## Step 5: Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3888](http://localhost:3888) to see your app!

## Switching Between Local and Cloud Database

### Method 1: Using Separate URLs (Recommended)

Set both URLs in `.env.local`:
```env
DATABASE_LOCAL_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder
DATABASE_CLOUD_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/workflow_builder?sslmode=require
```

**To use local database:**
```env
USE_CLOUD_DB=false
```

**To use cloud database:**
```env
USE_CLOUD_DB=true
```

Then run migrations:
```bash
pnpm db:push
```

### Method 2: Using DATABASE_URL (Explicit)

You can also set `DATABASE_URL` directly (this takes highest priority):
```env
# Local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder

# Or Cloud
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/workflow_builder?sslmode=require
```

### Quick Toggle Script

Create a helper script to toggle:
```bash
# Use local
echo 'USE_CLOUD_DB=false' >> .env.local

# Use cloud
echo 'USE_CLOUD_DB=true' >> .env.local
```

## Troubleshooting

### "Unauthorized" Error

If you see authentication errors:

1. **Check session cookies are being sent:**
   - The API client now includes `credentials: 'include'` to send cookies
   - Make sure you're not blocking cookies in your browser

2. **Verify Better Auth configuration:**
   - Check `BETTER_AUTH_SECRET` is set
   - Check `BETTER_AUTH_URL` matches your dev server URL
   - Clear browser cookies and try again

3. **Anonymous sessions:**
   - The app uses Better Auth's anonymous plugin
   - Sessions are created automatically on first visit
   - If issues persist, try signing in/out

### Database Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Local
   pg_isready
   ```

2. **Verify connection string:**
   ```bash
   psql $DATABASE_URL
   ```

3. **Check database exists:**
   ```bash
   psql -l | grep workflow_builder
   ```

### Migration Issues

If migrations fail:

1. **Reset database (⚠️ deletes all data):**
   ```bash
   # Drop and recreate
   dropdb workflow_builder
   createdb workflow_builder
   pnpm db:push
   ```

2. **Check migration status:**
   ```bash
   pnpm db:studio
   # Opens Drizzle Studio to inspect database
   ```

## Development Workflow

1. **Make schema changes:**
   - Edit `lib/db/schema.ts`
   - Run `pnpm db:generate` to create migration
   - Run `pnpm db:push` to apply changes

2. **Type checking:**
   ```bash
   pnpm type-check
   ```

3. **Linting and formatting:**
   ```bash
   pnpm fix
   ```

4. **Run tests:**
   ```bash
   pnpm test:e2e
   ```

## Production Deployment

For production, use environment variables in your hosting platform:

- **Vercel:** Set in Project Settings → Environment Variables
- **Railway/Render:** Set in dashboard
- **Docker:** Use `.env` file or secrets

Make sure to:
- Use a strong `BETTER_AUTH_SECRET`
- Use a production database (Neon, Supabase, etc.)
- Set `BETTER_AUTH_URL` to your production domain
- Set `NEXT_PUBLIC_APP_URL` to your production domain

