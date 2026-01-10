# Combine Workflows + Vibecoder in One App

**Status**: In Progress  
**Date**: 2025-01-XX  
**Goal**: Combine capability (workflows) and vibecoder apps into one unified app with separate navigation

---

## Approach

**Strategy**: Use capability app as base, add vibecoder as a module with `/vibe` routes

### Navigation Structure

- **Workflows** → `/workflow` (existing)
- **Vibe** → `/vibe` (new, from vibecoder)
- **Chats** → `/chats` (shared, both can use)

---

## Phase 1: Add Navigation

### Step 1.1: Add "Vibe" Nav Item to Header

- Add nav items between logo and chat selector
- Show active state based on pathname
- Link to `/vibe` route

---

## Phase 2: Copy Vibecoder Routes

### Step 2.1: Copy Route Files

- Copy `/app/page.tsx` from vibecoder → `/app/vibe/page.tsx` in capability
- Copy `/app/chats/[chatId]/page.tsx` → keep as shared (already exists)
- Copy API routes from vibecoder → capability (merge or keep separate)

### Step 2.2: Copy Components

- Copy vibecoder components that are vibe-specific
- Keep shared components (use from @repo/ui or existing)

---

## Phase 3: Test & Refactor

### Step 3.1: Test Navigation

- ✅ Click "Workflows" → goes to `/workflow`
- ✅ Click "Vibe" → goes to `/vibe`
- ✅ Both work in same app

### Step 3.2: Refactor (Future)

- Once working, clean up duplicated code
- Consolidate shared components
- Optimize imports

---

## File Structure (Target)

```
apps/capability2.0/
  app/
    workflow/          # Workflows module
    vibe/              # Vibe module (NEW)
    chats/             # Shared chats
    api/
      workflows/       # Workflows API
      chat/            # Vibe chat API (merge with workflows chat?)
      chats/           # Shared chats API
```

---

## Notes

- Both modules use shared auth (already done)
- Both share same database (already done)
- Navigation should clearly separate the two modules
- Keep it simple first, refactor once working
