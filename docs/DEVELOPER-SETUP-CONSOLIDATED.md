# IdeaI Developer Setup - Complete Checklist

**Last Updated**: 2026-01-11  
**Status**: Automated validation system active

---

## 🎯 QUICK STATUS

You're seeing the **IdeaI Developer Setup Modal** because:

- ✅ Critical checks passed (you can use the site)
- ⚠️ Some warnings detected (optional improvements)
- The system is checking your local environment setup

**You can dismiss this modal** - it's informational. The warnings are optional but recommended for best experience.

---

## 📋 COMPLETE SETUP CHECKLIST

### 1. ✅ Database Migration (WARNING: Not Required, But Recommended)

**Status**: Database module not available - using local mode

**What it means**:

- The system can't access the database directly
- This is OK if you're running in local mode
- Database operations will use environment variables

**To Fix** (Optional):

```bash
# Option 1: Set DATABASE_URL
echo "DATABASE_URL=postgresql://user:pass@host:5432/db" >> apps/ideai-capabilities/.env.local

# Option 2: Run migration manually
cd apps/ideai-capabilities
pnpm db:push
```

**Or Skip**:

- Click "Got It" - local mode works without database
- Use environment variables for API keys instead

---

### 2. ⚠️ Auth Configuration (WARNING: Recommended)

**Status**: Missing `BETTER_AUTH_URL`

**What it means**:

- Authentication will work, but may have issues with callbacks
- Set this for proper OAuth flows

**To Fix**:

```bash
# Add to apps/ideai-capabilities/.env.local
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3018
```

**How to get secret**:

- Generate: `openssl rand -base64 32`
- Or use existing from production

**Impact**:

- ✅ Site works without it
- ⚠️ OAuth may not work properly
- ⚠️ Some auth features may be limited

---

### 3. ⚠️ Key Sync CLI Setup (WARNING: Optional)

**Status**: `IDEAI_USER_ID` not set

**What it means**:

- CLI key sync tool will prompt for user ID
- Not required unless using `pnpm key-sync` command

**To Fix** (Only if using CLI sync):

```bash
# Add to .env.local (root or app-specific)
IDEAI_USER_ID=your-user-id-from-database

# Or use flag when running
pnpm key-sync pull --user=your-user-id
```

**Or Skip**:

- Don't use CLI key sync
- Use web UI at `/settings/service-keys` instead

---

### 4. ✅ Service Keys (In Web UI)

**Status**: Manage via web interface

**Location**: `/settings/service-keys` or `http://localhost:3018/settings/service-keys`

**What it does**:

- Store API keys in database (encrypted)
- Sync between local and production
- Use same keys across all IdeaI apps

**To Set Up**:

1. Navigate to `/settings/service-keys`
2. Click "Add Key" for each service (AI Gateway, OpenAI, etc.)
3. Keys are encrypted and stored per user
4. Use "Copy from Production" to sync environments

**Required Keys** (if using that service):

- `AI_GATEWAY_API_KEY` - For AI Gateway integration
- `OPENAI_API_KEY` - For OpenAI features
- `V0_API_KEY` - For vibe coding features
- Others as needed

---

### 5. ✅ Environment Variables (In .env.local)

**Location**: `apps/ideai-capabilities/.env.local`

**Required Variables**:

```bash
# Database (if using database)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth (recommended)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3018

# Optional - for CLI sync
IDEAI_USER_ID=your-user-id

# API Keys (if not using web UI)
AI_GATEWAY_API_KEY=sk-...
OPENAI_API_KEY=sk-...
V0_API_KEY=v0_sk_...
```

**How to Create**:

```bash
cd apps/ideai-capabilities
cp .env.example .env.local  # If example exists
# Or create manually
touch .env.local
# Add variables above
```

---

## 🚀 QUICK START GUIDE

### Minimum Setup (Just Works)

1. ✅ Start the app: `pnpm --filter ideai-capabilities dev`
2. ✅ Sign in (or create account)
3. ✅ Dismiss the modal - you're ready!

**No database required** - everything works with environment variables.

---

### Full Setup (Recommended)

1. ✅ Database:

   ```bash
   cd apps/ideai-capabilities
   pnpm db:push  # Creates all tables
   ```

2. ✅ Auth:

   ```bash
   # Add to .env.local
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   BETTER_AUTH_URL=http://localhost:3018
   ```

3. ✅ Service Keys:
   - Visit `/settings/service-keys`
   - Add your API keys via web UI
   - Or set in `.env.local` if preferred

4. ✅ Reload app:
   - Refresh browser
   - Modal should show fewer warnings

---

## 📊 WHAT EACH CHECK DOES

### Database Migration Check

- **Checks**: If `user_service_keys` table exists
- **Required**: No (local mode works)
- **Impact**: Without it, API keys must be in `.env.local`

### Auth Configuration Check

- **Checks**: `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` set
- **Required**: No (auth works, but OAuth may not)
- **Impact**: Some auth features limited

### Service Keys Check

- **Checks**: If user has API keys in database
- **Required**: No (can use `.env.local` instead)
- **Impact**: Keys stored in DB = easier management

### Key Sync CLI Check

- **Checks**: `IDEAI_USER_ID` environment variable
- **Required**: Only if using CLI sync
- **Impact**: None if using web UI

### Environment Variables Check

- **Checks**: Critical env vars are set
- **Required**: Yes (for app to work)
- **Impact**: App won't start without these

---

## 🎯 CURRENT STATUS SUMMARY

Based on your modal:

| Check              | Status     | Required | Action                          |
| ------------------ | ---------- | -------- | ------------------------------- |
| Database Migration | ⚠️ Warning | No       | Optional: Run `pnpm db:push`    |
| Auth Configuration | ⚠️ Warning | No       | Optional: Set `BETTER_AUTH_URL` |
| Key Sync CLI       | ⚠️ Warning | No       | Optional: Set `IDEAI_USER_ID`   |
| Service Keys       | ✅ Check   | No       | Optional: Add via web UI        |
| Environment Vars   | ✅ Pass    | Yes      | ✅ Already set                  |

**Bottom Line**:

- ✅ **You can use the site now** - all critical checks passed
- ⚠️ **Warnings are optional** - improve setup if you want
- 🎯 **No blockers** - dismiss modal and continue

---

## 🔧 COMMON ISSUES

### "Database module not available"

**Cause**: DATABASE_URL not set or database not accessible  
**Solution**:

- Set `DATABASE_URL` in `.env.local`, OR
- Click "Got It" and use local mode (no DB needed)

### "Missing BETTER_AUTH_URL"

**Cause**: Auth URL not configured  
**Solution**:

- Add `BETTER_AUTH_URL=http://localhost:3018` to `.env.local`
- Or ignore if OAuth not needed

### "IDEAI_USER_ID not set"

**Cause**: CLI sync tool needs user ID  
**Solution**:

- Only needed if using `pnpm key-sync` CLI
- Otherwise ignore (use web UI at `/settings/service-keys`)

---

## 📝 ALL SETUP OPTIONS IN ONE PLACE

### Option 1: Minimal (Works Now)

- ✅ Start app
- ✅ Sign in
- ✅ Dismiss modal
- ✅ Use site

### Option 2: Recommended (Full Setup)

```bash
# 1. Database (optional)
cd apps/ideai-capabilities
pnpm db:push

# 2. Auth (recommended)
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "BETTER_AUTH_URL=http://localhost:3018" >> .env.local

# 3. Service Keys (via web UI)
# Visit: http://localhost:3018/settings/service-keys
# Add keys as needed

# 4. Reload app
# Refresh browser
```

### Option 3: Production-Like (Complete)

- All of Option 2, plus:
- Set all environment variables
- Set `IDEAI_USER_ID` for CLI sync
- Configure all service keys
- Set up database properly

---

## 🎯 NEXT STEPS

**Right Now**:

1. ✅ You can dismiss the modal
2. ✅ Start using the site
3. ✅ Test vibe functionality at `/vibe`

**Later** (Optional):

1. Fix warnings when convenient
2. Set up service keys via web UI
3. Configure auth for OAuth flows

**For Testing**:

- `/vibe` - Create vibe chats
- `/vibe/chats/[chatId]` - View chats
- `/settings/service-keys` - Manage keys
- Side menu - Toggle workflows/vibes

---

## 📚 RELATED DOCS

- **Full Guide**: `docs/development/DEVELOPER-SETUP-COMPLETE.md`
- **Next Steps**: `docs/development/NEXT-STEPS-FOR-DEVS.md`
- **Config Files**: `docs/development/ideai-file-distinction.md`
- **Vibe Port**: `docs/VIBE-PORT-PROGRESS.md`

---

**Summary**: You're all set! Warnings are optional. The site works. Fix them when you want better features.
