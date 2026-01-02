---
title: Vercel Project Configuration
description: Flexible Vercel project assignment - use same project or fork to new
---

# Vercel Project Configuration

Flexible system for configuring which Vercel project each app uses. Supports using the same project or forking to a new project.

## Overview

Each app can specify its Vercel project configuration in `.ideai.json`:

\`\`\`json
{
  "role": "parent",
  "name": "IdeaI",
  "vercelProject": {
    "projectName": "ideai-main",
    "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    "forkToNew": false
  }
}
\`\`\`

## Configuration Options

### `vercelProject.projectName`
- **Required**: Vercel project name to use
- **Example**: `"ideai-main"`, `"web"`, `"docs"`
- **Default**: App name (e.g., `"web"` → project `"web"`)

### `vercelProject.projectId`
- **Optional**: Explicit project ID for linking
- **Example**: `"prj_Se4sFOjdH4fRzSOsK8YDiNVFssHx"`
- **Use case**: When you know the exact project ID

### `vercelProject.orgId`
- **Optional**: Organization ID
- **Default**: `"team_vhjzlMi6CfNow0IfBXnv2Yn2"` (idea-i)
- **Example**: `"team_vhjzlMi6CfNow0IfBXnv2Yn2"`

### `vercelProject.forkToNew`
- **Optional**: Whether to create a new project if the specified one doesn't exist
- **Default**: `false`
- **When `true`**: Creates a new project with `newProjectName` if project doesn't exist

### `vercelProject.newProjectName`
- **Optional**: Name for new project when forking
- **Example**: `"web-v2"`, `"web-staging"`
- **Use case**: When `forkToNew: true`

## Use Cases

### 1. Use Existing Project (Same Project)

**Scenario**: Multiple apps deploy to the same Vercel project (e.g., monorepo with unified deployment)

\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
\`\`\`

**Result**: App links to existing `ideai-main` project

### 2. Fork to New Project

**Scenario**: Create a new project for an app (e.g., separate deployment, staging environment)

\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": true,
    "newProjectName": "web-staging"
  }
}
\`\`\`

**Result**: If `ideai-main` doesn't exist, creates `web-staging` project

### 3. Default (No Config)

**Scenario**: Use app name as project name (standard behavior)

\`\`\`json
{
  "role": "child",
  "name": "Docs"
  // No vercelProject = uses app name "docs" as project name
}
\`\`\`

**Result**: Links to project `"docs"` (or creates it if `forkToNew: true`)

## Linking Projects

### Automatic Linking (via deploy.sh)

The deployment script automatically links projects based on `.ideai.json`:

\`\`\`bash
./deploy.sh web
\`\`\`

If project is not linked, it will:
1. Read `.ideai.json` config
2. Link to specified project
3. Deploy

### Manual Linking

Link manually using the linker script:

\`\`\`bash
node scripts/ideai-vercel-link.mjs web
\`\`\`

Or use Vercel CLI directly:

\`\`\`bash
cd apps/web
vercel link --project ideai-main --scope team_vhjzlMi6CfNow0IfBXnv2Yn2
\`\`\`

## Branching Strategy

### Option 1: Same Project, Different Branches

**Use case**: All branches deploy to same project (preview deployments)

\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
\`\`\`

**Result**: 
- `main` branch → Production
- `develop` branch → Preview
- `feature/*` branches → Preview

### Option 2: Branch-Specific Projects

**Use case**: Separate projects for different environments

**Main branch** (`apps/web/.ideai.json`):
\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
\`\`\`

**Develop branch** (`apps/web/.ideai.json`):
\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main-staging",
    "forkToNew": true
  }
}
\`\`\`

### Option 3: App-Specific Projects

**Use case**: Each app has its own Vercel project

\`\`\`json
// apps/web/.ideai.json
{
  "vercelProject": {
    "projectName": "web",
    "forkToNew": false
  }
}

// apps/docs/.ideai.json
{
  "vercelProject": {
    "projectName": "docs",
    "forkToNew": false
  }
}
\`\`\`

## Examples

### Example 1: Web App Uses ideai-main Project

\`\`\`json
// apps/web/.ideai.json
{
  "role": "parent",
  "name": "IdeaI",
  "vercelProject": {
    "projectName": "ideai-main",
    "orgId": "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    "forkToNew": false
  }
}
\`\`\`

**Result**: `web` app deploys to `ideai-main` project (https://vercel.com/idea-i/ideai-main/)

### Example 2: Docs App Uses Separate Project

\`\`\`json
// apps/docs/.ideai.json
{
  "role": "child",
  "name": "Docs",
  "vercelProject": {
    "projectName": "docs",
    "forkToNew": false
  }
}
\`\`\`

**Result**: `docs` app deploys to `docs` project (https://vercel.com/idea-i/docs/)

### Example 3: Staging App Forks to New Project

\`\`\`json
// apps/web/.ideai.json (staging branch)
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": true,
    "newProjectName": "ideai-main-staging"
  }
}
\`\`\`

**Result**: If `ideai-main` doesn't exist, creates `ideai-main-staging` project

## Migration Guide

### Migrating from `web` to `ideai-main`

1. **Update `.ideai.json`**:
\`\`\`json
{
  "vercelProject": {
    "projectName": "ideai-main",
    "forkToNew": false
  }
}
\`\`\`

2. **Link to new project**:
\`\`\`bash
node scripts/ideai-vercel-link.mjs web
\`\`\`

3. **Verify**:
\`\`\`bash
cat apps/web/.vercel/project.json
# Should show: {"projectName": "ideai-main", ...}
\`\`\`

4. **Deploy**:
\`\`\`bash
./deploy.sh web
\`\`\`

## Best Practices

1. ✅ **Use existing projects** when possible (avoid project sprawl)
2. ✅ **Document project assignments** in `.ideai.json`
3. ✅ **Use descriptive project names** (e.g., `ideai-main`, not `web`)
4. ✅ **Set `forkToNew: false`** unless you explicitly want new projects
5. ✅ **Use branch-specific configs** for different environments
6. ✅ **Keep project names consistent** across team

## Troubleshooting

### Error: "Project not linked"

**Solution**: Run linker script:
\`\`\`bash
node scripts/ideai-vercel-link.mjs <app-name>
\`\`\`

### Error: "Project does not exist"

**Solution**: Either:
1. Create the project in Vercel dashboard first
2. Set `forkToNew: true` to auto-create

### Error: "Wrong project linked"

**Solution**: 
1. Delete `.vercel` directory: `rm -rf apps/<app>/.vercel`
2. Re-link: `node scripts/ideai-vercel-link.mjs <app>`

## Related Documentation

- [Vercel Configuration](../deployment/vercel.md)
- [Deployment Architecture](./deployment-architecture.md)
- [Branch Workflow](../development/branch-workflow.md)
