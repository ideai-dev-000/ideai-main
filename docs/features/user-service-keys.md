# User Service Keys Feature

## Overview

Centralized API key management system for IdeaI that stores user API keys encrypted in the database, with automatic fallback to environment variables.

## What's Implemented

### ✅ Database Schema

- New `user_service_keys` table with encryption
- Unique constraint on (user_id, service_type, environment)
- Migration file: `drizzle/0005_bizarre_the_spike.sql`

### ✅ Service Layer

- `getUserKey()` - Retrieves user key with env fallback
- `saveUserKey()` - Saves encrypted key
- `getUserKeys()` - Lists all user keys
- `deleteUserKey()` - Deletes a key
- `hasUserKey()` - Checks if key exists

### ✅ API Endpoints

- `GET /api/user-keys` - List all user's keys
- `POST /api/user-keys` - Create/update key
- `DELETE /api/user-keys/[keyId]` - Delete key
- `GET /api/user-keys/status` - Quick status check

### ✅ UI Component

- Settings page at `/settings/service-keys`
- Shows which services are configured
- Add/Update/Delete keys
- Shows key prefix (last 4 chars) for security

### ✅ AI Gateway Integration

- Updated `/api/ai/generate` to use user keys
- Falls back to env vars if no user key
- Detects AI Gateway vs OpenAI automatically

## Usage

### Add AI Gateway Key

1. Navigate to Settings > Service Keys
2. Click "Add Key" on AI Gateway card
3. Enter your Vercel AI Gateway API key
4. Click "Save Key"

### Check Status

Visit `/api/user-keys/status` to see which services have keys configured.

### Use in Code

```typescript
import { getUserKey } from "@/lib/services/user-keys";

// Get user's AI Gateway key (falls back to env var)
const apiKey =
  (await getUserKey(userId, "ai_gateway", "production")) ||
  process.env.AI_GATEWAY_API_KEY;
```

## Next Steps

- [ ] Update workflow execution to use user keys
- [ ] Add Vercel sync integration
- [ ] Add key rotation reminders
- [ ] Add usage analytics
