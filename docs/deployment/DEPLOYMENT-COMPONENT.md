---
title: IdeAIDeployment Component
description: Deployment testing and configuration component for all deployment strategies
---

# IdeAIDeployment Component

**Status**: ✅ **COMPLETED**  
**Created**: January 1, 2026  
**Location**: `packages/ui/src/components/ideai-deployment.tsx`

## Overview

The `IdeAIDeployment` component provides a comprehensive interface for testing and configuring all deployment strategies for IdeaI apps. It displays deployment options, allows testing each strategy, and provides logging for debugging.

## Features

### Deployment Strategies Supported

1. **Standalone Domain**
   - Deploy app with its own domain (e.g., `docs.myui.space`)
   - Status: Configured if `standaloneUrl` is set

2. **Subdomain (Parent Domain)**
   - Deploy as subdomain of parent (e.g., `docs.myui.space`)
   - Status: Not configured (requires DNS setup)

3. **Sub-Folder (Parent Domain)**
   - Deploy as sub-folder (e.g., `myui.space/apps/docs`)
   - Status: Available (currently working)

4. **Vercel Project**
   - Deploy as separate Vercel project
   - Status: Not configured (requires Vercel project setup)

### Component Features

- **Visual Status Indicators**: Color-coded status for each deployment option
- **Test Functionality**: Test each deployment strategy before full deployment
- **Real-time Logging**: Logs all test results and actions
- **Export Configuration**: Export deployment config for automation
- **Quick Actions**: Test all options at once

## Usage

### Basic Usage

\`\`\`tsx
import { IdeAIDeployment } from "@repo/ui/components/ideai-deployment";

<IdeAIDeployment
  appName="docs"
  appConfig={{
    name: "Documentation",
    description: "IdeaI documentation site",
    standaloneUrl: process.env.NEXT_PUBLIC_DOCS_URL,
    localPort: 3001,
  }}
  currentPath="/apps/docs"
  showLogs={true}
/>
\`\`\`

### Integration in Route

The component is automatically integrated into `/apps/[app]` routes when:
- App is not deployed standalone (no `standaloneUrl` set)
- In production mode
- Shows deployment options and testing tools

## Deployment Options

### Option 1: Standalone Domain

**Configuration**: Set environment variable `NEXT_PUBLIC_{APP}_URL`

**Example**:
\`\`\`bash
NEXT_PUBLIC_DOCS_URL=https://docs.myui.space
\`\`\`

**Status**: Shows as "configured" when URL is set

### Option 2: Subdomain

**Configuration**: 
- DNS: Add CNAME record for `{app}.myui.space`
- Vercel: Configure custom domain in project settings

**Test URL**: `https://{app}.myui.space`

**Status**: Shows as "not-configured" until DNS and Vercel are set up

### Option 3: Sub-Folder

**Configuration**: Already working via `/apps/[app]` route

**Test URL**: `https://myui.space/apps/{app}`

**Status**: Shows as "available" (currently working)

### Option 4: Vercel Project

**Configuration**:
- Create new Vercel project
- Set Root Directory: `apps/{app}`
- Enable "Include files outside root"

**Status**: Shows as "not-configured" until project is created

## Testing Workflow

1. **View Deployment Options**: Navigate to `/apps/{app}` in production
2. **Test Each Option**: Click "Test" button for each deployment strategy
3. **Review Logs**: Check logs panel for test results
4. **Export Config**: Click "Export Config" to get configuration JSON
5. **Deploy**: Use exported config to automate deployment

## Logs

The component logs:
- Test start/completion
- Test URLs
- Success/failure status
- Error messages
- Configuration exports

## Next Steps

1. **Test All Options**: Use component to test each deployment strategy
2. **Build Scripts**: Create automation scripts based on tested configurations
3. **Document Patterns**: Document successful deployment patterns
4. **Automate**: Build full automation once all options are tested

## Integration with Deployment Scripts

The component is designed to work with deployment automation scripts:

\`\`\`bash
# Test deployment options
./scripts/test-deployment.sh docs

# Deploy using specific strategy
./scripts/deploy-standalone.sh docs
./scripts/deploy-subdomain.sh docs
./scripts/deploy-subfolder.sh docs
./scripts/deploy-vercel-project.sh docs
\`\`\`

## Related Documentation

- [Multi-Strategy Deployment Plan](./MULTI-STRATEGY-DEPLOYMENT-PLAN.md)
- [Deployment Scripts](./deployment-scripts.md) (to be created)
- [Multi-Tenant Architecture](./multi-tenant-architecture.md) (to be created)


