# Key Management Testing Workflow

## Complete Testing Guide for Local & Production Keys

This guide walks you through testing the entire key management system, including local/production environments, syncing, and validation.

## Prerequisites

1. **Database Migration**: Ensure `user_service_keys` table exists

   ```bash
   cd apps/ideai-capabilities
   npx drizzle-kit push
   ```

2. **You're logged in** to the capabilities app (`http://localhost:3018`)

3. **Have test API keys ready**:
   - AI Gateway key (starts with `vck_`)
   - Or OpenAI key (starts with `sk-`)

## Test Workflow

### Step 1: Initial Setup - Add Production Key

1. Navigate to: `http://localhost:3018/settings/service-keys`
2. Verify you see all 6 services (AI Gateway, OpenAI, V0, Anthropic, Firecrawl, Exa)
3. Click **"Add production Key"** on AI Gateway
4. Enter your test AI Gateway key
5. Click **"Save Key"**
6. ✅ **Expected**: Key saved, card shows green checkmark, "☁️ Production Active" badge

### Step 2: Test Production Key Usage

1. Try using a workflow that needs AI (e.g., "Generate Text" action)
2. ✅ **Expected**: Workflow uses your production key from database
3. Check the key in UI - should show last used timestamp updating

### Step 3: Create Local Key for Testing

1. Switch environment dropdown to **"Local (Dev)"**
2. Click **"Add Local Key"** on AI Gateway
3. Enter a **different** test key (or same one if testing copy feature)
4. Click **"Save Key"**
5. ✅ **Expected**: Card shows "🔧 Local Active" badge, both local and production keys listed

### Step 4: Copy Key Between Environments

1. With Local selected, click **"📋 Copy from production"** button
2. Confirm the copy
3. ✅ **Expected**: Local key now matches production key (or vice versa)

### Step 5: Test Local Key Sync to .env.local

1. Open terminal in project root
2. Add your user ID to `.env.local`:
   ```bash
   echo "IDEAI_USER_ID=your-user-id-here" >> .env.local
   ```
3. Run sync to pull keys:
   ```bash
   pnpm key-sync pull
   ```
4. ✅ **Expected**: Keys copied to `.env.local` file
5. Check `.env.local` - should contain:
   ```bash
   AI_GATEWAY_API_KEY="vck_..."
   ```

### Step 6: Test Local Key Edit Workflow

1. Edit `.env.local` manually - change the AI Gateway key to a test value
2. Push changes back to database:
   ```bash
   pnpm key-sync push
   ```
3. ✅ **Expected**: Updated key saved to database
4. Refresh the UI - should show updated key prefix

### Step 7: Test Validation

1. Run validation:
   ```bash
   pnpm key-sync validate
   ```
2. ✅ **Expected**: Shows matches/mismatches between local and DB
3. If out of sync, pull again:
   ```bash
   pnpm key-sync pull
   ```

### Step 8: Test Environment Switching

1. In UI, switch between **Production** and **Local** environments
2. ✅ **Expected**:
   - Shows different keys for each environment
   - Active badges update accordingly
   - Status indicators show which is configured

### Step 9: Test Delete Key

1. Click trash icon on a key
2. Confirm deletion
3. ✅ **Expected**: Key removed, card shows "Add Key" button again

### Step 10: Test Local Mode (Offline)

1. Sign out (or open in incognito)
2. Navigate to settings page
3. Click **"Use Local Mode (Read-only)"**
4. ✅ **Expected**: Shows services but buttons disabled, no API calls

### Step 11: Test Fallback to Environment Variables

1. Delete a key from database (via UI)
2. Ensure that key exists in `.env.local` (or server env vars)
3. Use a workflow that needs that key
4. ✅ **Expected**: System falls back to env var, workflow still works

## Verification Checklist

- [ ] Can add production key via UI
- [ ] Can add local key via UI
- [ ] Can copy keys between environments
- [ ] Can delete keys
- [ ] Keys sync from DB to `.env.local` via CLI
- [ ] Keys sync from `.env.local` to DB via CLI
- [ ] Validation detects sync status correctly
- [ ] Environment toggle works
- [ ] Active environment badges show correctly
- [ ] Workflows use database keys first
- [ ] System falls back to env vars when DB key missing
- [ ] Local mode works offline (read-only)
- [ ] Status indicators show correct state

## Common Issues & Solutions

### Issue: API returns 500 error

**Solution**: Run database migration: `npx drizzle-kit push`

### Issue: Keys don't sync to .env.local

**Solution**: Check `IDEAI_USER_ID` is set in `.env.local`

### Issue: Validation always fails

**Solution**: Ensure keys are in sync - run `pnpm key-sync pull` first

### Issue: Buttons still don't work

**Solution**: Check you're logged in and hard refresh (Cmd+Shift+R)

## Success Criteria

✅ All checklist items pass  
✅ Keys store/retrieve correctly  
✅ Local/production separation works  
✅ CLI sync works both directions  
✅ Validation accurately detects sync status  
✅ UI reflects correct state  
✅ Workflows use correct keys
