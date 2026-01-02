# IdeaI Web App - Boilerplate & Documentation

This is the main IdeaI web application, serving as both a production app and a comprehensive boilerplate with integrated documentation.

## What is This?

The IdeaI web app is:
- **Production Application**: The main IdeaI application deployed at `myui.space`
- **Boilerplate Template**: A complete example of how to build IdeaI apps
- **Documentation Hub**: Integrated documentation viewer for AI assistants and developers

## Quick Start

### For Developers

```bash
# Install dependencies
pnpm install

# Start development server
pnpm --filter web dev

# Build for production
pnpm --filter web build

# Run linting
pnpm --filter web lint

# Type check
pnpm --filter web check-types
```

### For AI Assistants

This app includes comprehensive documentation accessible at:
- **Main docs**: `/docs` - Full IdeaI documentation
- **Filtered docs**: `/docs?category=deployment` - Filter by category
- **Specific path**: `/docs?path=deployment/vercel` - Filter by path

The documentation is automatically filtered and embedded from the IdeaI docs app.

## App Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── docs/              # Documentation viewer
│   ├── apps/              # Child app routes
│   ├── index/             # Apps index page
│   └── layout.tsx         # Root layout
├── .ideai.json            # IdeaI configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## IdeaI Configuration

This app is configured as a **parent app** in `.ideai.json`:

```json
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": ["docs", "all", "nocss", "mvp", ...],
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
```

### Key Configuration Options

- **`role`**: `"parent"` - This app serves child apps
- **`childApps`**: List of child app IDs
- **`vercelProject`**: Vercel project configuration
- **`metadata`**: App metadata (port, CSS, capabilities)

## Documentation Integration

### For AI Assistants

The app includes an `IdeAIDocsViewer` component that:
- Embeds documentation from the IdeaI docs app
- Filters by category, path, or search term
- Provides navigation sidebar
- Works in both development and production

**Usage in code:**
```tsx
import { IdeAIDocsViewer } from "@repo/ui";

<IdeAIDocsViewer 
  filter={{ category: "deployment" }}
  title="Deployment Guide"
/>
```

### For Developers

Access documentation:
1. **Local**: `http://localhost:3000/docs`
2. **Production**: `https://www.myui.space/docs`
3. **Filtered**: `http://localhost:3000/docs?category=deployment`

## Deployment

### Vercel Project

This app deploys to the `ideai-main` Vercel project:
- **Project**: `ideai-main`
- **Production URL**: `https://www.myui.space`
- **Root Directory**: `apps/web`

### Deployment Commands

```bash
# Preview deployment
./deploy.sh web

# Production deployment
./deploy.sh --prod web
```

## Development

### Local Development

```bash
# Start dev server
pnpm --filter web dev

# App runs on http://localhost:3000
```

### Child Apps

Child apps run on separate ports:
- `docs`: `http://localhost:3001`
- `all`: `http://localhost:3002`
- etc.

Access child apps via parent:
- `http://localhost:3000/apps/docs`
- `http://localhost:3000/apps/all`

## Architecture

### Parent-Child Structure

This app (parent) embeds child apps:
- Child apps are separate Next.js apps
- Embedded via iframes at `/apps/{name}`
- Child apps hide branding when embedded

### Documentation

Documentation is:
- Served from `apps/docs` app
- Embedded via `IdeAIDocsViewer` component
- Filtered by category/path/search
- Accessible to both AI and developers

## Key Features

1. **Unified App**: All apps on one domain
2. **Documentation**: Integrated docs viewer
3. **Boilerplate**: Complete example app
4. **Parent-Child**: Serves child apps
5. **Vercel Ready**: Configured for deployment

## Related Documentation

- [IdeaI Configuration](../../docs/architecture/ideai-config.md)
- [Parent-Child Architecture](../../docs/architecture/parent-child-complete.md)
- [Vercel Configuration](../../docs/deployment/vercel.md)
- [Deployment Guide](../../docs/deployment/overview.md)

## For AI Assistants

When working on this app:
1. Check `.ideai.json` for configuration
2. Use `IdeAIDocsViewer` for documentation
3. Follow parent-child architecture patterns
4. Reference `/docs` for detailed guides
5. Use `@repo/ui` components for consistency

## Support

- **Documentation**: `/docs` or `https://docs.myui.space`
- **Issues**: GitHub Issues
- **Questions**: Check `/docs` first
