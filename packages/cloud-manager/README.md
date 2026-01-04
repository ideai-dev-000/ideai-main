# Cloud Manager Package

Centralized cloud provider management for IdeaI monorepo. Supports multiple providers with unified UI and API.

## Providers

- ✅ **Vercel** - Full implementation (MVP)
- 🚧 **AWS** - Planned
- 🚧 **GCP** - Planned
- 🚧 **Azure** - Planned
- 🚧 **Hostinger** - Planned

## Features

- Query project settings from cloud providers
- Update configurations programmatically
- Auto-configure new projects
- Validate configurations
- Manage subdomains and sub-apps
- Track deployment issues/tickets

## Usage

```tsx
import { CloudManagerUI } from "@repo/cloud-manager/components/cloud-manager-ui";

<CloudManagerUI defaultProvider="vercel" />;
```

## Architecture

Each provider follows the same pattern:

- `{provider}/index.ts` - Main exports
- `{provider}/{provider}-client.ts` - API client
- `{provider}/{provider}-types.ts` - TypeScript types
- `{provider}/{provider}-config.ts` - Configuration utilities

UI components are provider-agnostic and use the provider clients.
