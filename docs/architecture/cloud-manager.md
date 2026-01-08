---
title: Cloud Manager Architecture
description: Centralized cloud provider management system for IdeaI monorepo
---

# Cloud Manager Architecture

## Overview

The Cloud Manager is a centralized system for managing cloud provider configurations across the IdeaI monorepo. It provides a unified UI and API for querying, updating, and auto-configuring deployment settings.

## Package Structure

```
packages/cloud-manager/
├── src/
│   ├── index.ts                    # Main exports
│   ├── components/
│   │   ├── cloud-manager-ui.tsx   # Main UI component
│   │   └── vercel/
│   │       └── vercel-manager.tsx  # Vercel-specific UI
│   └── providers/
│       ├── vercel/                 # Vercel provider (MVP)
│       │   ├── index.ts
│       │   ├── vercel-client.ts   # API client
│       │   ├── vercel-types.ts    # TypeScript types
│       │   └── vercel-config.ts   # Configuration utilities
│       ├── aws/                    # AWS provider (planned)
│       ├── gcp/                    # GCP provider (planned)
│       ├── azure/                  # Azure provider (planned)
│       └── hostinger/              # Hostinger provider (planned)
└── README.md
```

## Features

### Current (Vercel MVP)

- ✅ **Project Management**: List all Vercel projects
- ✅ **Settings Query**: View current project settings (Root Directory, Build Command, etc.)
- ✅ **Settings Update**: Update project settings via UI
- ✅ **Auto-Configuration**: One-click setup for new projects
- ✅ **Validation**: Verify settings are correct for monorepo structure
- ✅ **Error Handling**: Clear error messages with setup instructions
- ✅ **Domain Display**: View live domains for each project
- ✅ **Database Management**: Connect, sync, and manage databases

### Planned (Other Providers)

- 🚧 **AWS**: EC2, S3, CloudFront management
- 🚧 **GCP**: Cloud Run, Cloud Storage management
- 🚧 **Azure**: App Service, Storage management
- 🚧 **Hostinger**: Shared hosting management

## Usage

### Access

The Cloud Manager is accessible at:

- **Local**: http://localhost:3000/cloud
- **Production**: https://www.myui.space/cloud

### Navigation

The Cloud Manager is accessible from the main navigation:

- Header → "Cloud Manager" (between "Documentation" and "Animations")

### Setup

1. **Get Vercel Token**:
   - Go to: https://vercel.com/account/tokens
   - Create a new token with Team scope
   - Copy the token

2. **Configure Token**:

   ```bash
   node scripts/setup-vercel-token.mjs YOUR_TOKEN
   ```

3. **Restart Dev Server**:
   ```bash
   pnpm --filter web dev
   ```

## API Routes

### GET `/api/vercel/projects`

List all Vercel projects for the team.

**Query Parameters**:

- `teamId` (optional): Team ID (defaults to configured team)

**Response**:

```json
{
  "data": [
    { "id": "prj_xxx", "name": "pico" },
    { "id": "prj_yyy", "name": "web" }
  ]
}
```

### GET `/api/vercel/projects/[projectId]/settings`

Get project settings.

**Query Parameters**:

- `teamId` (optional): Team ID

**Response**:

```json
{
  "data": {
    "rootDirectory": "apps/pico",
    "buildCommand": "next build",
    "installCommand": "pnpm install",
    "outputDirectory": ".next",
    "framework": "nextjs",
    "includeFilesOutsideRoot": true
  }
}
```

### PATCH `/api/vercel/projects/[projectId]/settings`

Update project settings.

**Body**:

```json
{
  "rootDirectory": "apps/pico",
  "buildCommand": "next build",
  "sourceFilesOutsideRootDirectory": true
}
```

**Response**: Same as GET

## Vercel Provider Implementation

### Client (`vercel-client.ts`)

Handles all Vercel API interactions:

- `getProjectSettings()`: Fetch current settings
- `updateProjectSettings()`: Update settings
- `listProjects()`: List all projects
- `getDeployments()`: Get deployment history

### Configuration (`vercel-config.ts`)

Utilities for managing configurations:

- `autoConfigureVercelProject()`: Auto-setup new projects
- `validateVercelConfig()`: Validate configuration

### Types (`vercel-types.ts`)

TypeScript definitions:

- `VercelProjectConfig`: Project configuration
- `VercelProjectSettings`: Current settings
- `VercelDeployment`: Deployment information

## UI Components

### CloudManagerUI

Main component with provider tabs:

- Tabbed interface for different providers
- Shows "Coming Soon" for planned providers
- Defaults to Vercel tab

### VercelManager

Vercel-specific management UI:

- Project selector dropdown
- Settings editor with real-time updates
- Auto-configure button
- Configuration status indicators
- Save on blur (text inputs) or manual save button
- Unsaved changes indicator

## Best Practices

### Token Security

- ✅ Token stored server-side only (`VERCEL_TOKEN` in `.env.local`)
- ✅ Never exposed to client
- ✅ API routes proxy all requests

### Error Handling

- Clear error messages with actionable steps
- Token setup instructions when missing
- Detailed error logging for debugging

### User Experience

- Local state updates immediately (no API calls on every keystroke)
- Save on blur for text inputs
- Manual save button for batch changes
- Auto-reload after save to confirm

## Future Enhancements

1. **Environment Variable Management** ⚠️ **CRITICAL PRIORITY**
   - **GOAL**: Codify (automate) all Vercel dashboard clicks
   - **Short-term**: Use CLI directly to fast-track operations (see `docs/deployment/vercel-env-management.md`)
   - **Long-term**: Cloud Manager UI automates all CLI operations (no more dashboard clicks)
   - View all environment variables for a project
   - Set/update environment variables via UI (using CLI under the hood)
   - Sync from local `.env.local` files to Vercel
   - Bulk operations (set multiple variables at once)
   - **Standard Method**: Use Vercel CLI commands (`vercel env add`)
   - **Learning Rule**: Document each CLI operation so Cloud Manager can automate it later
   - **Pattern**: Extract from `.env.local` → Set in Vercel via CLI → Cloud Manager codifies this

2. **Subdomain Management**: Configure custom domains per project
3. **Sub-app Management**: Manage child app configurations
4. **Deployment History**: View and manage deployments
5. **Issue Tracking**: Link to deployment tickets/issues
6. **Multi-Provider**: Support AWS, GCP, Azure, Hostinger
7. **Bulk Operations**: Update multiple projects at once

## Related Documentation

- [Vercel Deployment](./vercel.md)
- [Vercel Project Config](./vercel-project-config.md)
- [Deployment Architecture](./deployment-architecture.md)
