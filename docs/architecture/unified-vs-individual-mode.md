---
title: Unified vs Individual Mode
description: Toggle between unified (all on port 3000) and individual (separate ports) modes
---

# Unified vs Individual Mode

IdeaI supports two modes for running child apps:

## Unified Mode (Default in Production)

**All apps run on port 3000** - Child apps are imported as components into the parent app.

- ✅ One unified app on port 3000
- ✅ Child apps are routes/services within the main app
- ✅ No branding in child apps (they detect context and hide header/footer)
- ✅ Same domain, same codebase
- ✅ Production-ready

**How it works**:
- Child app pages are imported into parent at build time
- Registry maps app names to components
- `/apps/{name}` routes to child app component directly
- Child apps detect they're embedded and hide branding

## Individual Mode (Default in Development)

**Each app runs on its own port** - Child apps run as separate servers, embedded via iframe.

- ✅ Each app on separate port (3001, 3002, etc.)
- ✅ Complete isolation
- ✅ Easy to test individual apps
- ✅ Good for development/testing

**How it works**:
- Each child app runs on its own port
- Parent app embeds child apps via iframe
- Child apps detect iframe and hide branding
- Useful for development and testing

## Toggle Mode

Set environment variable:

\`\`\`bash
# Unified mode (all on port 3000)
NEXT_PUBLIC_IDEAI_APP_MODE=unified

# Individual mode (separate ports)
NEXT_PUBLIC_IDEAI_APP_MODE=individual
\`\`\`

**Defaults**:
- Production: `unified` (always)
- Development: `individual` (can be toggled)

## Setting Up Unified Mode

1. **Register child apps** in `apps/web/app/apps/[app]/registry.ts`:

\`\`\`ts
import DocsPage from "../../../../docs/app/page";
registerChildApp("docs", DocsPage);
\`\`\`

2. **Set environment variable**:

\`\`\`bash
NEXT_PUBLIC_IDEAI_APP_MODE=unified
\`\`\`

3. **Start only parent app**:

\`\`\`bash
pnpm --filter web dev
\`\`\`

4. **Access child apps**:

- `http://localhost:3000/apps/docs` → Docs app (no branding)
- `http://localhost:3000/apps/all` → All app (no branding)

## Benefits

### Unified Mode
- ✅ One app, one port
- ✅ Production-ready
- ✅ Child apps are services/pages
- ✅ No iframe overhead

### Individual Mode
- ✅ Complete isolation
- ✅ Easy debugging
- ✅ Test apps independently
- ✅ Development-friendly

## Architecture

\`\`\`
Unified Mode:
┌─────────────────────────────────┐
│  Parent App (port 3000)         │
│  ┌───────────────────────────┐  │
│  │ /apps/docs → DocsPage     │  │
│  │ /apps/all → AllPage       │  │
│  │ /apps/nocss → NoCSSPage   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Individual Mode:
┌─────────────────┐  ┌──────────────┐
│ Parent (3000)   │  │ Docs (3001)  │
│  ┌───────────┐  │  │              │
│  │ <iframe>  │──┼─▶│              │
│  └───────────┘  │  └──────────────┘
└─────────────────┘
\`\`\`

## Next Steps

1. ✅ Mode toggle implemented
2. ⏳ Register child apps in registry
3. ⏳ Test unified mode
4. ⏳ Update build system for unified mode
