# Environment Variables Security Guide

## ⚠️ Security Best Practices

**CRITICAL**: Never commit secrets to git. All environment variables must be:

- Stored in Vercel dashboard (encrypted automatically)
- Added to `.env.local` files locally (already in `.gitignore`)
- Never included in documentation with actual values

## Required Environment Variables

### Main Web App (`ideai-main`)

**Vercel Project**: `ideai-main`

Required variables:

- `VERCEL_TOKEN` - Vercel API token for Cloud Manager functionality

**To set up:**

1. Go to https://vercel.com/idea-i/ideai-main/settings/environment-variables
2. Add `VERCEL_TOKEN` with your Vercel API token
3. Select environments: Production, Preview, Development
4. Values are automatically encrypted by Vercel

### IdeaI Builder (`ideai-builder`)

**Vercel Project**: `ideai-builder`

Required variables:

- `AUTH_SECRET` - Authentication secret (generate with `openssl rand -base64 32`)
- `POSTGRES_URL` - PostgreSQL database connection string
- `V0_API_KEY` - v0 API key from https://v0.dev/chat/settings/keys

**To set up:**

1. Go to https://vercel.com/idea-i/ideai-builder/settings/environment-variables
2. Add all required variables
3. Values are automatically encrypted by Vercel

### IdeaI Workflow (`ideai-workflow`)

**Vercel Project**: `ideai-workflow`

Required variables:

- `DATABASE_URL` - PostgreSQL database connection string
- `BETTER_AUTH_SECRET` - Better Auth secret (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Auth URL (production URL for production, http://localhost:3013 for local)
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `INTEGRATION_ENCRYPTION_KEY` - Encryption key (generate with `openssl rand -hex 32`)
- `AI_GATEWAY_API_KEY` - Optional: AI Gateway API key

**To set up:**

1. Go to https://vercel.com/idea-i/ideai-workflow/settings/environment-variables
2. Add all required variables
3. Values are automatically encrypted by Vercel

### Lead Processing Agent (`lead-processing-agent`)

**Vercel Project**: `lead-processing-agent`

Required variables:

- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key
- `EXA_API_KEY` - Exa API key
- `SLACK_BOT_TOKEN` - Slack bot token
- `SLACK_SIGNING_SECRET` - Slack signing secret
- `SLACK_CHANNEL_ID` - Slack channel ID

**To set up:**

1. Go to https://vercel.com/idea-i/lead-processing-agent/settings/environment-variables
2. Add all required variables
3. Values are automatically encrypted by Vercel

## Local Development

For local development, create `.env.local` files in each app directory:

```bash
# Example: apps/web/.env.local
VERCEL_TOKEN=your-vercel-token-here
```

**Important:**

- `.env.local` files are already in `.gitignore`
- Never commit `.env.local` files
- Use different values for local vs production

## Verifying Environment Variables

### Check Vercel Dashboard

1. Navigate to project settings → Environment Variables
2. Verify all required variables are set
3. Check that values are encrypted (type: "encrypted")

### Pull from Vercel (for local development)

```bash
cd apps/[app-name]
vercel link
vercel env pull .env.local
```

## Security Checklist

- [ ] All secrets removed from documentation
- [ ] All environment variables set in Vercel dashboard
- [ ] All values encrypted in Vercel
- [ ] `.env.local` files in `.gitignore`
- [ ] No secrets in git history (if found, rotate immediately)
- [ ] Different secrets for production vs development
