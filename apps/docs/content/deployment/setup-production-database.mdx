# Setup Production Database Connection

**Last Updated**: January 8, 2026

Quick guide to set up production database connection so `myui.space` uses the same database as local development.

---

## Current Status

- **Local Development**: ✅ Connected to Neon cloud database
- **Production (myui.space)**: ❌ `DATABASE_URL` not set in Vercel environment variables

---

## Setup Steps

### Step 1: Get Your Local DATABASE_URL

**Option A: From .env.local file**

```bash
# View the DATABASE_URL from your local config
cat apps/ideai-capabilities/.env.local | grep DATABASE_URL
```

**Option B: Via Cloud Manager UI**

1. Go to: http://localhost:3000/cloud → Database tab
2. Click "Check Status" (for local environment)
3. The connection string will be displayed (password masked)

### Step 2: Set DATABASE_URL in Vercel

**Via Vercel Dashboard** (Recommended):

1. Go to: https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables
2. Click **"Add New"**
3. **Key**: `DATABASE_URL`
4. **Value**: Paste your Neon database connection string (same as local)
5. **Environments**: Select all three:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
6. Click **"Save"**

**Via Vercel CLI**:

```bash
# Set DATABASE_URL for production environment
vercel env add DATABASE_URL production

# When prompted, paste your DATABASE_URL value
# Repeat for preview and development if needed
```

### Step 3: Verify Setup

**Via Cloud Manager UI**:

1. Go to: http://localhost:3000/cloud → Database tab
2. Click "Connect to Production"
3. Should successfully connect and show the database URL

**Via CLI**:

```bash
node scripts/ideai-db-manager.mjs connect --env production --app ideai-capabilities
```

### Step 4: Redeploy Production

After setting environment variables, you need to redeploy for them to take effect:

**Via Vercel Dashboard**:

1. Go to: https://vercel.com/idea-i/ideai-capabilities/deployments
2. Click "..." menu on latest deployment
3. Click "Redeploy"

**Via Vercel CLI**:

```bash
cd apps/ideai-capabilities
vercel --prod
```

**Via Git** (automatic):

- Push a commit to trigger a new deployment
- Environment variables are automatically included

---

## After Setup

Once `DATABASE_URL` is set in Vercel:

✅ **Production (myui.space) will connect to the same Neon database**
✅ **Local and production will share data**
✅ **Changes made locally will appear on myui.space**
✅ **Users/workflows created locally will be visible in production**

---

## Important Notes

### Current Shared Database Setup

**After setup, both local and production use the same database:**

- Same Neon cloud database (`ep-cold-band-absecb56-pooler.eu-west-2.aws.neon.tech/neondb`)
- Same data (users, workflows, etc.)
- Changes are immediately visible in both environments

**Why this is okay for now:**

- ✅ Simplified setup
- ✅ Easy testing
- ✅ No data sync needed

**Future considerations:**

- Database separation is planned (see TODOs)
- When separated, local and production will have different databases
- Sync feature will then copy data from local → production

---

## Troubleshooting

### Error: "DATABASE_URL not found in Vercel environment variables"

**Solution**: Follow Step 2 above to add `DATABASE_URL` to Vercel

### Error: "Cannot connect to database"

**Check**:

1. DATABASE_URL is correctly set in Vercel
2. Database URL format is correct (postgresql://...)
3. Database is accessible (check Neon dashboard)
4. SSL mode is set correctly (`?sslmode=require` for Neon)

### Production Still Not Connected After Setup

**Solution**:

1. Verify environment variable is set for "Production" environment
2. Redeploy production (see Step 4)
3. Check deployment logs in Vercel dashboard

---

## Related Documentation

- [Database Architecture](./database-architecture.md) - Complete architecture overview
- [Database Management](./database-management.md) - Management guide
- [Database Sync Workflow](./database-sync-workflow.md) - Sync process

---

**Status**: Once `DATABASE_URL` is set in Vercel, production will use the same database as local development.
