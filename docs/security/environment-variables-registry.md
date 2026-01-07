# Environment Variables Registry

Complete registry of all environment variables used across IdeaI apps with categorization and status.

## Registry Overview

This registry categorizes variables by:
- **Category**: `shared` (same value across apps) or `app-specific` (different per app)
- **Client-side**: `true` if `NEXT_PUBLIC_*` (exposed to browser), `false` otherwise
- **Required**: `true` if app won't work without it, `false` if optional
- **Apps**: Which apps use this variable

## Shared Variables

These should have the **same value** across multiple apps.

### Database

#### `DATABASE_URL`
- **Category**: Shared
- **Client-side**: No
- **Required**: Yes
- **Apps**: `ideai-capabilities`, `ideai-workflow`
- **Description**: PostgreSQL connection string - MUST be same across all apps using shared database
- **Example**: `postgresql://user:password@localhost:5432/workflow_builder`

### Authentication

#### `BETTER_AUTH_SECRET`
- **Category**: Shared
- **Client-side**: No
- **Required**: Yes
- **Apps**: `ideai-capabilities`, `ideai-workflow`
- **Description**: Better Auth secret - MUST be same across apps for unified auth
- **Generate**: `openssl rand -base64 32`

#### `INTEGRATION_ENCRYPTION_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: Yes
- **Apps**: `ideai-capabilities`, `ideai-workflow`
- **Description**: Encryption key for storing integration credentials in database
- **Generate**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### AI Gateway

#### `AI_GATEWAY_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`, `ideai-workflow`, `lead-processing-agent`
- **Description**: Vercel AI Gateway API key for AI workflow generation
- **Example**: `vck_...`

#### `OPENAI_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: OpenAI API key (fallback if AI_GATEWAY_API_KEY not set)
- **Example**: `sk-...`

### Integration Keys

These can also be set in the UI (Settings > Integrations).

#### `SLACK_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Slack bot token
- **Example**: `xoxb-...`

#### `LINEAR_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Linear API key
- **Example**: `lin_api_...`

#### `LINEAR_TEAM_ID`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Linear team ID

#### `RESEND_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Resend API key
- **Example**: `re_...`

#### `RESEND_FROM_EMAIL`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Resend from email
- **Example**: `noreply@example.com`

#### `FIRECRAWL_API_KEY`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Firecrawl API key
- **Example**: `fc-...`

### OAuth Credentials (Server-Side)

#### `GITHUB_CLIENT_ID`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: GitHub OAuth client ID (server-side)

#### `GITHUB_CLIENT_SECRET`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: GitHub OAuth client secret (server-side only - never expose)

#### `GOOGLE_CLIENT_ID`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Google OAuth client ID (server-side)

#### `GOOGLE_CLIENT_SECRET`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Google OAuth client secret (server-side only - never expose)

#### `VERCEL_CLIENT_ID`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Vercel OAuth client ID for AI Gateway User Keys

#### `VERCEL_CLIENT_SECRET`
- **Category**: Shared
- **Client-side**: No
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Vercel OAuth client secret (server-side only - never expose)

## App-Specific Variables

These have **different values** per app.

#### `BETTER_AUTH_URL`
- **Category**: App-specific
- **Client-side**: No
- **Required**: Yes
- **Apps**: 
  - `ideai-capabilities`: `http://localhost:3018`
  - `ideai-workflow`: `http://localhost:3013`
- **Description**: Auth URL - app-specific (different port per app)

#### `NEXT_PUBLIC_APP_URL`
- **Category**: App-specific
- **Client-side**: Yes (exposed to browser)
- **Required**: No
- **Apps**: 
  - `ideai-capabilities`: `http://localhost:3018`
  - `ideai-workflow`: `http://localhost:3013`
- **Description**: Public app URL - exposed to browser, app-specific

#### `VERCEL_TOKEN`
- **Category**: App-specific
- **Client-side**: No
- **Required**: No
- **Apps**: `web`
- **Description**: Vercel API token for Cloud Manager (web app only)

## Client-Side Variables (`NEXT_PUBLIC_*`)

These are **exposed to the browser** - only use for values that are safe for public access.

⚠️ **Security Warning**: Never put secrets in `NEXT_PUBLIC_*` variables!

#### `NEXT_PUBLIC_AUTH_PROVIDERS`
- **Category**: Shared
- **Client-side**: Yes
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Comma-separated list of enabled auth providers
- **Example**: `github,google,vercel`

#### `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- **Category**: Shared
- **Client-side**: Yes
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: GitHub OAuth client ID (client-side - safe to expose)
- **Note**: Can be different from server-side `GITHUB_CLIENT_ID` if using separate OAuth apps

#### `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Category**: Shared
- **Client-side**: Yes
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Google OAuth client ID (client-side - safe to expose)
- **Note**: Can be different from server-side `GOOGLE_CLIENT_ID` if using separate OAuth apps

#### `NEXT_PUBLIC_VERCEL_CLIENT_ID`
- **Category**: Shared
- **Client-side**: Yes
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Vercel OAuth client ID (client-side - safe to expose)
- **Note**: Can be different from server-side `VERCEL_CLIENT_ID` if using separate OAuth apps

#### `NEXT_PUBLIC_AI_GATEWAY_MANAGED_KEYS_ENABLED`
- **Category**: Shared
- **Client-side**: Yes
- **Required**: No
- **Apps**: `ideai-capabilities`
- **Description**: Enable AI Gateway managed keys feature
- **Example**: `true`

## Usage

### Setup Script

Use the setup script to automatically manage shared credentials:

```bash
node scripts/ideai-develop-setup-local-env.mjs
```

The script:
1. Detects existing shared values across apps
2. Prompts you once for shared credentials
3. Applies shared values to all selected apps
4. Handles app-specific variables with correct defaults
5. Separates client-side variables appropriately

### Manual Setup

If setting up manually, ensure:
- Shared variables have the same value across apps
- App-specific variables have the correct per-app values
- Client-side variables (`NEXT_PUBLIC_*`) are only used for safe values

## Registry Source

This registry is generated from `scripts/ideai-env-registry.mjs`. The setup script uses this registry to automatically manage environment variables.

## See Also

- [Environment Variables Security Guide](./environment-variables.md) - Complete setup guide
- [Unified Auth System](../architecture/unified-auth-system.md) - Why some vars must be shared


