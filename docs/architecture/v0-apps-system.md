# V0 Apps System Architecture

## Overview

The `__v0/` folder system allows dropping v0-generated Next.js apps into the IdeaI monorepo without requiring monorepo dependencies. Each app is completely self-contained.

## Structure

```
ideai-main/
├── __v0/                          # Root folder for v0 apps
│   ├── demo-v0-app/              # Example v0 app
│   │   ├── package.json          # App metadata (name, description)
│   │   ├── app/
│   │   │   ├── layout.tsx        # Next.js metadata (title, description)
│   │   │   └── page.tsx
│   │   ├── node_modules/         # Self-contained dependencies
│   │   └── ...
│   └── another-v0-app/
│       └── ...
├── apps/                          # Regular monorepo apps
└── packages/                      # Shared packages
```

## Metadata Sources

Each v0 app provides metadata from:

1. **package.json**:
   - `name` - App name
   - `description` - App description
   - `version` - Version number

2. **app/layout.tsx** (Next.js metadata):
   - `metadata.title` - Display title
   - `metadata.description` - Display description

## API Route: `/api/v0-apps`

Scans `__v0/` folder and returns:

```typescript
interface V0AppMetadata {
  id: string; // Folder name
  name: string; // From package.json.name or metadata.title
  description: string; // From package.json.description or metadata.description
  version?: string; // From package.json.version
  path: string; // URL path: /v0/[id]
  folderPath: string; // Filesystem path
}
```

## Landing Page: `/v0`

- Displays all v0 apps in a grid of cards
- Each card shows:
  - Name
  - Description
  - "Open App" button (links to `/v0/[id]`)

## Routing Strategy

Option 1: Proxy via Next.js API route

- `/v0/[id]` → API route that serves the v0 app
- More complex but keeps apps isolated

Option 2: Direct links (for now)

- Cards link to `http://localhost:XXXX` (each app runs on its own port)
- Simple but requires each app to be running

Option 3: Iframe embedding

- Embed v0 apps in iframe on `/v0/[id]` page
- Each app runs independently

**Initial Implementation**: Option 2 - Direct links with port information

- Each app can specify its port in a `.v0.json` config file
- Or default port calculation based on folder index

## Port Allocation

For v0 apps that need to run:

- Start at port 4000
- Increment by 1 for each app
- Store in `.v0.json` or `package.json` scripts

## Development Workflow

1. Drop v0-generated app folder into `__v0/`
2. App automatically appears on `/v0` landing page
3. App runs independently with its own `node_modules`
4. No monorepo dependencies required

## Configuration File (Optional)

`.v0.json` in each app folder:

```json
{
  "port": 4000,
  "enabled": true,
  "category": "demo"
}
```

## Future Enhancements

- [ ] Auto-start v0 apps via dev menu
- [ ] Iframe embedding for preview
- [ ] Vercel deployment integration
- [ ] App status (running/stopped)
- [ ] Port management
