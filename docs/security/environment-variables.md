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

### IdeaI Capabilities (`ideai-capabilities`)

**Vercel Project**: `ideai-capabilities`

Required variables:

- `DATABASE_URL` - PostgreSQL database connection string
- `BETTER_AUTH_SECRET` - Better Auth secret (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Auth URL (production URL for production, `http://localhost:3018` for local)
- `INTEGRATION_ENCRYPTION_KEY` - Encryption key (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

Optional variables:

- `AI_GATEWAY_API_KEY` - Vercel AI Gateway API key (for AI workflow generation)
- `SLACK_API_KEY` - Slack bot token (can also be set in UI)
- `LINEAR_API_KEY` - Linear API key (can also be set in UI)
- `LINEAR_TEAM_ID` - Linear team ID (can also be set in UI)
- `RESEND_API_KEY` - Resend API key (can also be set in UI)
- `RESEND_FROM_EMAIL` - Resend from email (can also be set in UI)
- `FIRECRAWL_API_KEY` - Firecrawl API key (can also be set in UI)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `VERCEL_CLIENT_ID` - Vercel OAuth client ID (for AI Gateway User Keys)
- `VERCEL_CLIENT_SECRET` - Vercel OAuth client secret

**To set up:**

1. Go to https://vercel.com/idea-i/ideai-capabilities/settings/environment-variables
2. Add all required variables
3. Values are automatically encrypted by Vercel

**Local Development:**

See [Local Development](#local-development) section below for interactive setup.

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

### Quick Setup (Recommended)

Use the interactive setup script to create `.env.local` files with **shared credentials support**:

```bash
node scripts/ideai-develop-setup-local-env.mjs
```

**Features:**
- ✅ **Shared credentials**: Set once, automatically synced to all selected apps
- ✅ **Client-side variables**: Support for `NEXT_PUBLIC_*` variables (exposed to browser)
- ✅ **App-specific variables**: Different values per app (e.g., ports, URLs)
- ✅ **Auto-generation**: Secrets and encryption keys generated automatically
- ✅ **Smart detection**: Detects existing values in other apps and offers to reuse

**How it works:**
1. Select which apps to set up (ideai-capabilities, ideai-workflow, web)
2. Set up shared credentials once (DATABASE_URL, AI_GATEWAY_API_KEY, etc.)
3. Script automatically applies shared values to all selected apps
4. App-specific variables (like BETTER_AUTH_URL) are set per app with correct defaults
5. Client-side variables (`NEXT_PUBLIC_*`) are handled separately and marked appropriately

### Manual Setup

Each app includes a `.env.example` file with all required and optional variables:

1. **Copy the example file:**
   ```bash
   # For ideai-capabilities
   cp apps/ideai-capabilities/.env.example apps/ideai-capabilities/.env.local
   
   # For web app
   cp apps/web/.env.example apps/web/.env.local
   ```

2. **Edit `.env.local` and fill in your values:**
   ```bash
   # Edit with your preferred editor
   code apps/ideai-capabilities/.env.local
   ```

3. **Generate secrets:**
   ```bash
   # Generate BETTER_AUTH_SECRET
   openssl rand -base64 32
   
   # Generate INTEGRATION_ENCRYPTION_KEY
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### IdeaI Capabilities Required Variables

For `apps/ideai-capabilities`, you **must** set:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL` - `http://localhost:3018` for local dev
- `INTEGRATION_ENCRYPTION_KEY` - Generate with Node.js crypto

Optional but recommended:
- `AI_GATEWAY_API_KEY` - For AI workflow generation
- Integration keys (SLACK_API_KEY, LINEAR_API_KEY, etc.) - Can also be set in UI

### Shared vs App-Specific Variables

**Shared Variables** (same value across apps):
- `DATABASE_URL` - Must be same for unified auth system
- `BETTER_AUTH_SECRET` - Must be same for unified auth system
- `AI_GATEWAY_API_KEY` - Can be shared across apps
- Integration keys (SLACK_API_KEY, LINEAR_API_KEY, etc.) - Can be shared

**App-Specific Variables** (different per app):
- `BETTER_AUTH_URL` - Different port per app (e.g., `http://localhost:3018` vs `http://localhost:3013`)
- `NEXT_PUBLIC_APP_URL` - Different URL per app
- `VERCEL_TOKEN` - Only needed for web app

**Client-Side Variables** (`NEXT_PUBLIC_*`):
- Exposed to browser - safe for public access
- Examples: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- **Security Note**: Never put secrets in `NEXT_PUBLIC_*` variables

### Important Notes

- `.env.local` files are already in `.gitignore`
- Never commit `.env.local` files
- `.env.example` files are safe to commit (they contain no secrets)
- Use different values for local vs production
- You can add integration credentials later in the UI (Settings > Integrations)
- **Shared credentials**: Use the setup script to ensure consistency across apps

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
