---
title: IdeaI App Configuration
description: How to configure apps as parent or child using .ideai.json
---

# IdeaI App Configuration

Simple configuration system to set app roles (parent/child) using `.ideai.json` files.

## Overview

Each app in the monorepo can have a `.ideai.json` file that defines:

- **Role**: `parent` or `child`
- **Name**: Display name
- **Description**: App description
- **Child apps** (for parent): List of child app IDs
- **Parent app** (for child): Parent app ID
- **Local port** (for child): Development server port

## Configuration File

Create `.ideai.json` in each app's root directory:

### Parent App Example

\`\`\`json
{
"role": "parent",
"name": "IdeaI",
"description": "Main IdeaI application",
"childApps": [
"docs",
"all",
"nocss",
"mvp",
"tailwind",
"allcss",
"bootstrap",
"unocss",
"shadcn"
]
}
\`\`\`

### Child App Example

\`\`\`json
{
"role": "child",
"name": "Documentation",
"description": "IdeaI documentation site",
"parentApp": "web",
"localPort": 3001
}
\`\`\`

## Switching App Roles

### Make an App a Parent

1. Create `.ideai.json` in the app directory:
   \`\`\`json
   {
   "role": "parent",
   "name": "My Parent App",
   "childApps": ["child1", "child2"]
   }
   \`\`\`

2. Update child apps to reference this parent:
   \`\`\`json
   {
   "role": "child",
   "parentApp": "my-parent-app"
   }
   \`\`\`

### Make an App a Child

1. Create `.ideai.json` in the app directory:
   \`\`\`json
   {
   "role": "child",
   "name": "My Child App",
   "parentApp": "web",
   "localPort": 3010
   }
   \`\`\`

2. Add the child to parent's `childApps` array:
   \`\`\`json
   {
   "role": "parent",
   "childApps": ["my-child-app"]
   }
   \`\`\`

## Default Behavior

If `.ideai.json` is missing:

- `web` app defaults to **parent**
- All other apps default to **child** with `parentApp: "web"`

## Usage in Code

\`\`\`typescript
import { getChildAppConfig, isParentApp, isChildApp } from "@repo/ui";

// Get child app config
const config = getChildAppConfig("docs");
// Returns: { role: "child", name: "Documentation", parentApp: "web", localPort: 3001 }

// Check app role
if (isParentApp("web")) {
// Handle parent app logic
}

if (isChildApp("docs")) {
// Handle child app logic
}
\`\`\`

## File Locations

- Parent app: `apps/web/.ideai.json`
- Child apps: `apps/{app-name}/.ideai.json`

## Example: Switching Parent

To make `docs` the parent instead of `web`:

1. **Update `apps/docs/.ideai.json`**:
   \`\`\`json
   {
   "role": "parent",
   "name": "Documentation Hub",
   "childApps": ["web", "all"]
   }
   \`\`\`

2. **Update `apps/web/.ideai.json`**:
   \`\`\`json
   {
   "role": "child",
   "name": "Web App",
   "parentApp": "docs",
   "localPort": 3000
   }
   \`\`\`

3. **Update other child apps** to reference `docs` as parent

## Related

- [Parent-Child Architecture](./deployment-architecture.md#parent-child-architecture)
- [Sub-App Routing](../../apps/web/app/apps/[app]/[[...path]]/page.tsx)


