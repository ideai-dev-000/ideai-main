# VibeCoder Port Status - Current State & What's Left

**Date**: 2026-01-11  
**Goal**: Port vibecoder (3020) functionality into capabilities app (3018) so both workflows and vibes work alongside each other in one unified app.

---

## ✅ WHAT'S ALREADY DONE

### 1. **Shared Infrastructure** ✅

**Status**: Complete - Both apps use same systems

**Shared Resources**:

- ✅ **Same Database**: Both use Neon DB (shared PostgreSQL)
- ✅ **Same Auth**: Both use `@repo/ideai-user/auth` (Better Auth)
- ✅ **Same Vercel**: Both deployed to same Vercel org
- ✅ **Same APIs**: Both call v0 SDK for chats
- ✅ **Same User Abstraction**: Unified user accounts across apps

**Database Tables Shared**:

- `users` - Shared user accounts
- `sessions` - Shared sessions
- `chat_ownerships` - Vibe chat ownership mapping
- `workflows` - Workflow definitions (capabilities only)
- `workflow_executions` - Workflow runs (capabilities only)

---

### 2. **Side Menu Integration** ✅

**Status**: Complete - UI supports both workflows and vibes

**What Works**:

- ✅ Side menu component (`IdeAISideMenu`) has workflows/vibes toggle
- ✅ `contentMode` state management (workflows vs vibes)
- ✅ Vibe items display in side menu
- ✅ Auto-detects route (`/vibe` or `/workflow`) to switch modes
- ✅ "Create Vibe" button exists

**Files**:

- `packages/ui/src/components/ideai-side-menu.tsx` - Has vibes support
- `apps/ideai-capabilities/components/ideai-side-menu-wrapper.tsx` - Loads vibes

**Current Behavior**:

- Loads vibes via `/api/vibes` proxy
- Routes to external vibecoder app (`http://localhost:3020`) when clicking vibes
- Side menu shows vibes list correctly

---

### 3. **API Proxy Route** ✅

**Status**: Complete - Capabilities app can fetch vibes

**Route**: `apps/ideai-capabilities/app/api/vibes/route.ts`

**What It Does**:

- Proxies to vibecoder API or queries shared DB directly
- Returns user's vibe chats for side menu
- Handles authentication automatically

**Current State**: ✅ Working

---

### 4. **Vibe Page Route** ✅

**Status**: Partial - Route exists but redirects to vibecoder

**Route**: `apps/ideai-capabilities/app/vibe/page.tsx`

**Current Behavior**:

- Uses `HomeClient` component (same as vibecoder)
- But routes currently point to external vibecoder app
- Creates new vibes by redirecting to `http://localhost:3020`

---

### 5. **Database Migration** ✅

**Status**: Complete - All tables exist

**What's Migrated**:

- ✅ `user_service_keys` table (for API key management)
- ✅ `chat_ownerships` table (for vibe chat ownership)
- ✅ All workflow tables
- ✅ Shared auth tables

**Migration System**:

- ✅ Real-time streaming migration endpoint
- ✅ Tracks migration progress
- ✅ Saves status to `.ideai-dev.json`

---

## ⚠️ WHAT'S NOT DONE - NEEDS PORTING

### 1. **Vibe Routes Not Ported** ❌ CRITICAL

**Status**: Routes don't exist in capabilities app

**Missing Routes**:

- ❌ `/chats` - List of all chats (vibes)
- ❌ `/chats/[chatId]` - Individual chat detail page
- ❌ Chat creation flow (currently redirects to vibecoder)

**Current State**:

- `/vibe` route exists but incomplete
- Clicking "Create Vibe" redirects to external vibecoder app
- Chat detail pages don't exist in capabilities

---

### 2. **Vibe Components Not Ported** ❌ CRITICAL

**Status**: Components still only in vibecoder app

**Missing Components**:

- ❌ `HomeClient` - Main vibe chat interface (partially used)
- ❌ `ChatDetailClient` - Individual chat page
- ❌ `ChatsClient` - Chat list page
- ❌ `PreviewPanel` - Code preview with iframe
- ❌ `IdeAIAssets` - Asset viewer (shared but may need integration)
- ❌ `ChatInput` - Message input component
- ❌ `MessageRenderer` - Message display component

**Location**: All in `apps/ideai-vibecoder/components/`

---

### 3. **Vibe API Routes Not Ported** ❌ CRITICAL

**Status**: APIs only exist in vibecoder app

**Missing API Routes**:

- ❌ `/api/chat` - Create/send messages to v0 API
- ❌ `/api/chats/[chatId]` - Get chat details
- ❌ `/api/chats/[chatId]/download` - Download chat as ZIP
- ❌ `/api/chats/[chatId]/assets/extract` - Extract assets
- ❌ `/api/chats/[chatId]/assets` - List extracted assets
- ❌ `/api/chats/[chatId]/visibility` - Update chat privacy
- ❌ `/api/chat/fork` - Fork a chat
- ❌ `/api/chat/delete` - Delete a chat
- ❌ `/api/chat/ownership` - Manage ownership

**Current**: Only `/api/vibes` proxy exists (for side menu list)

---

### 4. **Vibe Hooks & Utilities** ❌ NEEDED

**Status**: Not ported

**Missing**:

- ❌ `use-chat.ts` - Chat hook for message handling
- ❌ Chat utilities (file extraction, asset processing)
- ❌ v0 SDK integration utilities

---

### 5. **Routing Integration** ❌ NEEDED

**Status**: Routes point to external app

**Issues**:

- ❌ "Create Vibe" redirects to `http://localhost:3020`
- ❌ Vibe items in side menu link to external vibecoder
- ❌ No internal routing for `/chats/[chatId]`

**Current Code**:

```typescript
// In ideai-side-menu-wrapper.tsx
const handleCreateVibe = useCallback(async () => {
  const vibecoderUrl =
    process.env.NEXT_PUBLIC_VIBECODER_URL || "http://localhost:3020";
  window.location.href = `${vibecoderUrl}/`; // ❌ External redirect
}, []);
```

---

## 📋 PORTING CHECKLIST

### Phase 1: Routes & Pages

- [ ] Create `/chats` page (list all chats)
- [ ] Create `/chats/[chatId]` page (chat detail)
- [ ] Update `/vibe` page (main vibe interface)
- [ ] Fix routing to use internal routes (not external)

### Phase 2: Components

- [ ] Port `HomeClient` component
- [ ] Port `ChatDetailClient` component
- [ ] Port `ChatsClient` component
- [ ] Port `PreviewPanel` component
- [ ] Port `ChatInput` component
- [ ] Port `MessageRenderer` component
- [ ] Integrate `IdeAIAssets` component (already shared)

### Phase 3: API Routes

- [ ] Port `/api/chat` (create/send messages)
- [ ] Port `/api/chats/[chatId]` (get chat details)
- [ ] Port `/api/chats/[chatId]/download`
- [ ] Port `/api/chats/[chatId]/assets/extract`
- [ ] Port `/api/chats/[chatId]/assets`
- [ ] Port `/api/chats/[chatId]/visibility`
- [ ] Port `/api/chat/fork`
- [ ] Port `/api/chat/delete`
- [ ] Port `/api/chat/ownership`

### Phase 4: Hooks & Utilities

- [ ] Port `use-chat.ts` hook
- [ ] Port chat utilities
- [ ] Port asset extraction utilities

### Phase 5: Integration

- [ ] Update side menu to use internal routes
- [ ] Update "Create Vibe" to use internal route
- [ ] Test workflows and vibes side-by-side
- [ ] Verify toggle works correctly
- [ ] Test chat creation flow
- [ ] Test chat detail pages

---

## 🔍 CURRENT ARCHITECTURE

### VibeCoder App (Port 3020)

**Purpose**: Standalone vibe coding app

**Routes**:

- `/` - Home (chat interface)
- `/chats` - Chat list
- `/chats/[chatId]` - Chat detail

**APIs**:

- `/api/chat` - Create/send messages
- `/api/chats` - List chats
- `/api/chats/[chatId]` - Get chat details
- `/api/chats/[chatId]/download` - Download ZIP
- `/api/chats/[chatId]/assets/*` - Asset management

**Database**: Shared Neon DB (same as capabilities)

---

### Capabilities App (Port 3018)

**Purpose**: Unified app with workflows + vibes

**Current Routes**:

- `/` - Landing page
- `/workflow` - Workflow builder
- `/workflow/workflows/[id]` - Individual workflow
- `/vibe` - Vibe page (incomplete, uses HomeClient but redirects externally)
- `/app-builder` - Cloud manager
- `/settings/service-keys` - Key management
- `/dev-setup` - Dev setup checker

**Current APIs**:

- `/api/workflows/*` - Workflow APIs
- `/api/vibes` - Proxy to fetch vibe list (for side menu)
- `/api/dev-setup/*` - Dev setup APIs
- `/api/database/*` - DB management APIs
- `/api/user-keys/*` - Key management APIs

**Missing**: All vibe-specific API routes

---

## 🎯 WHAT NEEDS TO HAPPEN

### Option 1: Full Port (Recommended)

**Approach**: Copy all vibe routes, components, and APIs into capabilities app

**Steps**:

1. Copy all `/api/chat*` and `/api/chats/*` routes
2. Copy all vibe components
3. Copy all vibe pages
4. Update routing to be internal
5. Remove external redirects
6. Test everything works

**Benefits**:

- ✅ Single unified app
- ✅ Same domain (no CORS issues)
- ✅ Shared components easier
- ✅ Better user experience

**Effort**: Medium (2-3 hours)

---

### Option 2: Iframe Embed (Quick)

**Approach**: Embed vibecoder app in capabilities via iframe

**Steps**:

1. Create iframe wrapper in capabilities
2. Handle routing between workflows and iframe
3. Share auth state

**Benefits**:

- ✅ Quick implementation
- ✅ Less code duplication

**Drawbacks**:

- ❌ iframe limitations
- ❌ Cross-origin issues
- ❌ Not ideal UX

**Effort**: Low (30 minutes) but not ideal

---

### Option 3: Route Proxy (Current State)

**Approach**: Keep vibecoder separate, proxy routes through capabilities

**Current State**: This is what's partially done

**Issues**:

- ❌ External redirects (not seamless)
- ❌ Two separate apps
- ❌ CORS complications
- ❌ Not true integration

---

## 🔧 TECHNICAL DETAILS

### Shared Dependencies

Both apps already use:

- ✅ `@repo/ideai-user/auth` - Same auth system
- ✅ `v0-sdk` - Same v0 API client
- ✅ Same database schema (shared Neon DB)
- ✅ Same environment variables pattern

### Database Tables

**Shared**:

- `users`, `sessions`, `accounts` - Auth
- `chat_ownerships` - Vibe chat ownership

**Capabilities Only**:

- `workflows`, `workflow_executions`, etc.

**VibeCoder Only**:

- (None - all shared)

### API Endpoints Needed

All vibe APIs need to be copied to capabilities:

1. `/api/chat` - POST (create/send)
2. `/api/chats` - GET (list)
3. `/api/chats/[chatId]` - GET (details)
4. `/api/chats/[chatId]/download` - GET
5. `/api/chats/[chatId]/assets/extract` - POST
6. `/api/chats/[chatId]/assets` - GET
7. `/api/chats/[chatId]/visibility` - PATCH
8. `/api/chat/fork` - POST
9. `/api/chat/delete` - POST
10. `/api/chat/ownership` - POST

---

## 📊 COMPLETION STATUS

### Infrastructure: ✅ 100%

- Shared DB: ✅
- Shared Auth: ✅
- Shared Vercel: ✅
- Shared APIs: ✅

### UI Integration: ✅ 70%

- Side menu: ✅ Complete
- Toggle: ✅ Complete
- Vibe list: ✅ Complete
- Routing: ❌ External redirects

### Backend Routes: ❌ 10%

- Proxy route: ✅ (`/api/vibes`)
- All other APIs: ❌ Not ported

### Frontend Routes: ❌ 30%

- `/vibe` page: ✅ Exists (incomplete)
- `/chats` page: ❌ Missing
- `/chats/[chatId]` page: ❌ Missing

### Components: ❌ 0%

- All components: ❌ Still in vibecoder only

---

## 🚀 RECOMMENDED APPROACH

### Phase 1: Port APIs (1-2 hours)

Copy all API routes from vibecoder to capabilities:

- All `/api/chat*` routes
- All `/api/chats/*` routes
- Test each route works

### Phase 2: Port Components (1-2 hours)

Copy all vibe components:

- Chat components
- Preview components
- Input components
- Message components

### Phase 3: Port Pages (30 minutes)

Create vibe pages:

- `/chats` page
- `/chats/[chatId]` page
- Update `/vibe` page

### Phase 4: Update Routing (30 minutes)

Fix all redirects to use internal routes:

- Update side menu links
- Update "Create Vibe" button
- Test navigation

### Phase 5: Testing (1 hour)

- Test chat creation
- Test chat viewing
- Test workflows + vibes toggle
- Test asset extraction
- Test download

**Total Estimated Time**: 4-6 hours

---

## 📝 CURRENT ISSUES

### 1. External Redirects

**Problem**: Clicking vibes redirects to external vibecoder app

**Location**: `apps/ideai-capabilities/components/ideai-side-menu-wrapper.tsx`

**Current Code**:

```typescript
const handleCreateVibe = useCallback(async () => {
  const vibecoderUrl =
    process.env.NEXT_PUBLIC_VIBECODER_URL || "http://localhost:3020";
  window.location.href = `${vibecoderUrl}/`; // ❌ External
}, []);
```

**Fix**: Route to `/vibe` or `/chats` internally

---

### 2. Missing Chat Pages

**Problem**: No `/chats` or `/chats/[chatId]` routes in capabilities

**Fix**: Create these pages and port components

---

### 3. Missing Chat APIs

**Problem**: Only `/api/vibes` proxy exists

**Fix**: Port all chat APIs from vibecoder

---

## ✅ SUMMARY

### What's Working

- ✅ Side menu shows vibes
- ✅ Toggle between workflows/vibes works
- ✅ Vibe list loads correctly
- ✅ Shared infrastructure (DB, auth, Vercel)

### What's Missing

- ❌ Internal vibe routes (`/chats`, `/chats/[chatId]`)
- ❌ Vibe API routes (all chat APIs)
- ❌ Vibe components (chat UI, preview, etc.)
- ❌ Internal routing (currently redirects externally)

### Next Steps

1. Port all vibe APIs to capabilities
2. Port all vibe components
3. Create vibe pages
4. Fix routing to be internal
5. Test end-to-end

**Priority**: HIGH - This is blocking full integration
