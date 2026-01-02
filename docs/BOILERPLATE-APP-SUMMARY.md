# Boilerplate App Summary

## Overview

The IdeaI web app (`apps/web`) is now a complete boilerplate with integrated documentation viewer, serving as both a production application and a template for new IdeaI apps.

## What Was Created

### 1. IdeAIDocsViewer Component
- **Location**: `packages/ui/src/components/ideai-docs-viewer.tsx`
- **Purpose**: Embeds and filters IdeaI documentation from the docs app
- **Features**:
  - Navigation sidebar with categories
  - Filtering by category, path, or search term
  - Responsive design
  - Works in development and production

### 2. Documentation Route
- **Location**: `apps/web/app/docs/page.tsx`
- **URL**: `/docs`
- **Features**:
  - Server component for performance
  - Query parameter support: `?category=deployment`, `?path=deployment/vercel`, `?search=vercel`
  - Automatic filtering based on URL parameters

### 3. Comprehensive READMEs
- **`apps/web/README.md`**: Complete guide for developers and AI assistants
- **`README.md`**: Updated monorepo overview with boilerplate info

## URLs

### Production (Live)
- **Main App**: https://www.myui.space
- **Docs Viewer**: https://www.myui.space/docs
- **Filtered Docs**: https://www.myui.space/docs?category=deployment
- **Apps Index**: https://www.myui.space/index

### Development (Local)
- **Main App**: http://localhost:3000
- **Docs Viewer**: http://localhost:3000/docs
- **Filtered Docs**: http://localhost:3000/docs?category=deployment
- **Docs App**: http://localhost:3001

### Vercel Project
- **Project**: `ideai-main`
- **Organization**: `idea-i`
- **Dashboard**: https://vercel.com/idea-i/ideai-main

## Features

### For Developers
1. **Quick Start**: Clear instructions in README
2. **Documentation Access**: Integrated docs viewer at `/docs`
3. **Boilerplate Template**: Complete example app structure
4. **Parent-Child Architecture**: Serves child apps at `/apps/{name}`

### For AI Assistants
1. **Documentation Viewer**: Accessible at `/docs`
2. **Filtered Documentation**: Query parameters for specific topics
3. **App Configuration**: `.ideai.json` files in each app
4. **Comprehensive READMEs**: Guides for both AI and developers

## Configuration

### App Configuration (`.ideai.json`)
\`\`\`json
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": ["docs", "all", "nocss", ...],
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  },
  "metadata": {
    "id": "web",
    "port": 3000,
    "css": ["MVP.css", "Tailwind CSS", "IdeaI Design System"],
    "capabilities": ["Full UI components", "Shared design tokens", "Dark mode support"]
  }
}
\`\`\`

## Usage Examples

### Accessing Documentation
\`\`\`bash
# Main docs viewer
https://www.myui.space/docs

# Filtered by category
https://www.myui.space/docs?category=deployment

# Filtered by path
https://www.myui.space/docs?path=deployment/vercel

# Search
https://www.myui.space/docs?search=vercel
\`\`\`

### Using the Component
\`\`\`tsx
import { IdeAIDocsViewer } from "@repo/ui";

<IdeAIDocsViewer 
  filter={{ category: "deployment" }}
  title="Deployment Guide"
  showNav={true}
/>
\`\`\`

## Deployment

### Deploy Command
\`\`\`bash
./deploy.sh --prod web
\`\`\`

### Deployment Process
1. Links to `ideai-main` Vercel project
2. Builds the app
3. Deploys to production
4. Available at `https://www.myui.space`

## Current Status

✅ **Completed**:
- IdeAIDocsViewer component created
- `/docs` route implemented
- READMEs written for AI and developers
- Local testing verified
- Production deployment successful

✅ **Working**:
- Documentation viewer loads correctly
- Navigation sidebar displays
- Iframe embeds docs app
- Filtering by category/path/search
- Responsive design

## Next Steps

1. **Use as Boilerplate**: Copy `apps/web` structure for new apps
2. **Customize Documentation**: Add app-specific docs to filter
3. **Extend Features**: Add more filtering options as needed
4. **Deploy More Apps**: Use same pattern for other IdeaI apps

## Related Documentation

- [IdeaI Configuration](../architecture/ideai-config.md)
- [Parent-Child Architecture](../architecture/parent-child-complete.md)
- [Vercel Configuration](../architecture/vercel-project-config.md)
- [Deployment Guide](../deployment/overview.md)

---

**Last Updated**: 2026-01-01
**Status**: ✅ Production Ready


