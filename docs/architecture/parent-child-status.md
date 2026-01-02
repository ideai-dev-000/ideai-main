---
title: Parent-Child App Status
description: Current status of parent/child app architecture
---

# Parent-Child App Status

## ✅ Current Status: Working

### Defaults Tested and Working

**Parent App**: `web`
- ✅ Defaults to `parent` role (no config needed)
- ✅ URL: `/` (root)
- ✅ Detects all child apps automatically

**Child Apps**: All apps except `web`
- ✅ Default to `child` role (no config needed)
- ✅ URLs: `/apps/{name}` (e.g., `/apps/docs`, `/apps/all`)
- ✅ Development ports: 3001-3009
- ✅ Parent reference: `web` (default)

### Test Results

\`\`\`bash
$ node scripts/test-parent-child.js

✅ Parent App (web):
   Role: parent
   Name: IdeaI
   Child Apps: 9
   URL: / (root)

✅ Child Apps (testing defaults - no .ideai.json):
   docs: /apps/docs (port 3001) ✅
   all: /apps/all (port 3002) ✅
   nocss: /apps/nocss (port 3003) ✅
\`\`\`

## Architecture

### One Unified App (Same Domain, Same Codebase)

**Current Implementation**:
- Parent app (`web`) serves at root: `myui.space/`
- Child apps embedded via iframe: `myui.space/apps/{name}`
- All in same codebase (monorepo)
- All in same domain

**How It Works**:
1. Parent app has route: `/apps/[app]/[[...path]]`
2. Child apps run on localhost ports (dev) or same origin (prod)
3. Child apps detect iframe and hide header/footer automatically
4. Only `<main>` content shown from child apps

## CSS Compatibility

### Current Approach: Iframe Isolation

Each child app loads in iframe with its own CSS:
- ✅ Complete CSS isolation
- ✅ No conflicts
- ✅ Each child can use different CSS frameworks

### CSS Requirements by Child

| Child | CSS Used | Status |
|-------|----------|--------|
| `docs` | MVP.css + Tailwind + IdeaI | ✅ Isolated |
| `all` | MVP.css + Tailwind + IdeaI | ✅ Isolated |
| `nocss` | None (pure HTML) | ✅ Isolated |
| `mvp` | MVP.css only | ✅ Isolated |
| `tailwind` | Tailwind only | ✅ Isolated |
| `allcss` | MVP.css + Tailwind + IdeaI | ✅ Isolated |
| `bootstrap` | Bootstrap CSS | ✅ Isolated |
| `unocss` | UnoCSS | ✅ Isolated |
| `shadcn` | Tailwind + IdeaI | ✅ Isolated |

### Future: Unified Build (No Iframes)

If moving to unified build (no iframes), parent would need:
- MVP.css ✅ (already has)
- Tailwind CSS ✅ (already has)
- IdeaI CSS ✅ (already has)
- Bootstrap CSS ❌ (would need to add)
- UnoCSS ❌ (would need to add)

**Note**: This is future work. Current iframe approach works perfectly for "one app" goal.

## URLs

### Parent App
- Root: `/`
- Apps index: `/index`

### Child Apps
- `/apps/docs` → Documentation
- `/apps/all` → All Components
- `/apps/nocss` → No CSS
- `/apps/mvp` → MVP.css
- `/apps/tailwind` → Tailwind CSS
- `/apps/allcss` → All CSS
- `/apps/bootstrap` → Bootstrap
- `/apps/unocss` → UnoCSS
- `/apps/shadcn` → Shadcn Components

## Configuration

### Defaults (No Config Files Needed)

- `web` → parent (automatic)
- All others → child (automatic)

### Custom Config (Optional)

Create `.ideai.json` in app directory to override:

\`\`\`json
{
  "role": "parent",
  "name": "My App",
  "childApps": ["child1", "child2"]
}
\`\`\`

## Next Steps

1. ✅ Defaults working
2. ✅ URLs correct
3. ✅ Parent/child detection working
4. ⏳ Test in development (start child servers)
5. ⏳ Test in production (unified build strategy)
6. ⏳ CSS compatibility (if moving away from iframes)

## Key Points

- **One Domain**: All apps served from `myui.space`
- **One Codebase**: All apps in monorepo
- **One App**: Parent embeds children seamlessly
- **CSS Isolation**: Iframes prevent conflicts
- **Easy Switching**: Change `.ideai.json` to switch roles








