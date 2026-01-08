# Setup Guide

This guide will help you complete the setup of the v0 clone project.

## ✅ Completed Steps

1. ✅ Dependencies installed
2. ✅ Package.json updated to use npm versions of @v0-sdk/react and v0-sdk

## 📋 Next Steps

### 1. Create `.env` File

Create a `.env` file in the root directory with the following content:

```bash
# Auth Secret - Generate with: openssl rand -base64 32
# Or visit: https://generate-secret.vercel.app/32
AUTH_SECRET=your-generated-auth-secret-here

# Database URL - PostgreSQL connection string
# For local development: postgresql://user:password@localhost:5432/v0_clone
# For Vercel Postgres, use the connection string from your dashboard
POSTGRES_URL=postgresql://user:password@localhost:5432/v0_clone

# Get your API key from https://v0.dev/chat/settings/keys
V0_API_KEY=your_v0_api_key_here

# Optional: Use a custom API URL
# V0_API_URL=http://localhost:3001/v1
```

**⚠️ SECURITY WARNING**: 
- **NEVER commit `.env.local` files to git** - they are already in `.gitignore`
- Only store actual secrets in `.env.local` files (never in markdown files)
- Use placeholders in documentation files

**Important:** Replace the following values:
- `POSTGRES_URL`: Your PostgreSQL database connection string
- `V0_API_KEY`: Your v0 API key from https://v0.dev/chat/settings/keys

### 2. Set Up PostgreSQL Database

You have a few options:

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database: `createdb v0_clone`
3. Update `POSTGRES_URL` in `.env` with your local connection string

#### Option B: Vercel Postgres
1. Create a Vercel Postgres database in your Vercel dashboard
2. Copy the connection string
3. Update `POSTGRES_URL` in `.env` with the connection string

#### Option C: Other Cloud Providers
- Neon (https://neon.tech)
- Supabase (https://supabase.com)
- Railway (https://railway.app)
- Any PostgreSQL-compatible database

### 3. Run Database Migrations

Once your `.env` file is configured with `POSTGRES_URL`, run:

```bash
pnpm db:migrate
```

This will create all the necessary database tables.

### 4. Start the Development Server

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔍 Verification

To verify your setup is correct, check that:
1. ✅ `.env` file exists with all required variables
2. ✅ Database connection is working (migrations run successfully)
3. ✅ Development server starts without errors

## 🆘 Troubleshooting

### Database Connection Issues
- Verify your `POSTGRES_URL` is correct
- Ensure your database server is running
- Check firewall settings if using a remote database

### Missing Environment Variables
The app will show a setup screen if required environment variables are missing.

### Package Installation Issues
If you encounter issues, try:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 Additional Resources

- [v0 Platform API Documentation](https://v0.dev/docs/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

