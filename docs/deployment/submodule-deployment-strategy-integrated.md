# Submodule Deployment Strategy: Integrated Approach

**Version**: 2.0.0  
**Last Updated**: January 3, 2026  
**Status**: Recommended Strategy  
**Priority**: High

---

## Overview

**Revised Strategy**: v0 submodules should be **integrated as child apps** within the IdeaI monorepo, not deployed separately. This allows:

- ✅ v0 apps to work within IdeaI monorepo
- ✅ Shared libraries (same libs on purpose)
- ✅ Next.js 16 compatibility
- ✅ v0 acts as developer/designer tool
- ✅ Integrated into parent-child architecture

---

## Core Principles

### 1. v0 as Integrated Child App

v0 submodules are **child apps** in the IdeaI parent-child architecture:

- **Parent App**: `web` (IdeaI main app)
- **Child App**: `ideai-designer` (v0 submodule)
- **Integration**: Embedded at `/apps/ideai-designer`
- **Mode**: Unified (all on port 3000) or Individual (separate port)

### 2. Shared Libraries (Same Libs on Purpose)

v0 submodules use the **same libraries** as IdeaI:

- ✅ `@repo/ui` - Shared UI components
- ✅ Next.js 16 - Same framework
- ✅ React 19 - Same React version
- ✅ Tailwind CSS - Same styling
- ✅ Shared dependencies from workspace

**Why**: v0 apps are designed to work **within** IdeaI, not separately.

### 3. v0 as Developer/Designer Tool

v0 submodules act like **employees who code and design**:

- ✅ Generate front-end designs in v0
- ✅ Export to IdeaI monorepo
- ✅ Align with IdeaI standards
- ✅ Use shared components from `@repo/ui`
- ✅ Help with UI/UX design work

**Workflow**: v0 → IdeaI alignment → Integrated child app

---

## Architecture

### Parent-Child Integration

```
IdeaI Monorepo
├── apps/
│   ├── web/ (Parent)
│   │   └── app/apps/[app]/[[...path]]/page.tsx
│   │       └── Embeds child apps at /apps/{name}
│   │
│   └── ideai-designer/ (Child - v0 submodule)
│       ├── .ideai.json (Child config)
│       ├── package.json (Uses @repo/ui)
│       └── app/ (Next.js 16 app)
│
└── packages/
    └── ui/ (Shared components)
        └── Used by both parent and child apps
```

### Deployment Modes

#### Unified Mode (Production)

- **All apps on port 3000**
- **Child apps embedded as iframes**
- **Same domain, same codebase**
- **v0 submodule accessible at**: `myui.space/apps/ideai-designer`

#### Individual Mode (Development)

- **Each app on separate port**
- **v0 submodule on**: `localhost:3013` (or assigned port)
- **Parent embeds via iframe**
- **Good for development/testing**

---

## Implementation Steps

### Step 1: Configure v0 Submodule as Child App

Create `.ideai.json` in `apps/ideai-designer/`:

```json
{
  "role": "child",
  "name": "IdeaI Designer",
  "description": "v0-powered design tool for IdeaI",
  "parentApp": "web",
  "localPort": 3013
}
```

### Step 2: Update Package.json to Use Shared Libraries

Update `apps/ideai-designer/package.json`:

```json
{
  "name": "@repo/ideai-designer",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@repo/ui": "workspace:*",
    "next": "16.1.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*"
  }
}
```

**Key Changes**:

- Use `@repo/ui` instead of individual Radix components
- Use workspace dependencies
- Match IdeaI versions (Next.js 16, React 19)

### Step 3: Update Parent App Configuration

Add to `apps/web/.ideai.json`:

```json
{
  "role": "parent",
  "name": "IdeaI",
  "childApps": [
    "docs",
    "all",
    "nocss",
    "mvp",
    "tailwind",
    "allcss",
    "bootstrap",
    "unocss",
    "shadcn",
    "material",
    "chakra",
    "radix",
    "ideai-designer"
  ]
}
```

### Step 4: Update CSS to Use Centralized Architecture

Update `apps/ideai-designer/app/globals.css`:

```css
/* Import centralized IdeaI CSS */
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";

/* App-specific layout adjustments only */
/* Use standard Tailwind classes + CSS variables from ideai.css */
```

### Step 5: Align Components with IdeaI Standards

After v0 export, align components:

1. **Use `@repo/ui` components** instead of local copies

   ```tsx
   // ❌ Before (v0 export)
   import { Button } from "@/components/ui/button";

   // ✅ After (IdeaI aligned)
   import { Button } from "@repo/ui/components/button";
   ```

2. **Apply semantic naming**
   - Rename files to kebab-case
   - Use parent-child naming patterns

3. **Add code headers**
   - Include @fileoverview, @module, @description

4. **Fix TypeScript types**
   - Remove `any` types
   - Use IdeaI type definitions

### Step 6: Deploy as Part of Main App

**Deployment Strategy**: Deploy v0 submodule as part of `web` app

**Vercel Configuration**:

- **Project**: `web` (main IdeaI project)
- **Root Directory**: `apps/web`
- **Include files outside root**: ✅ Enabled
- **v0 submodule**: Included automatically (Git submodule)

**How It Works**:

1. Deploy `web` app to Vercel
2. Vercel includes submodules (if configured)
3. v0 submodule accessible at: `myui.space/apps/ideai-designer`
4. All on same domain, same deployment

---

## Development Workflow

### Daily Workflow: v0 → IdeaI Integration

1. **Develop in v0**

   ```
   v0 → Generate design/code → Export
   ```

2. **Align with IdeaI Standards**

   ```
   Export → Apply IdeaI alignment checklist → Commit to submodule
   ```

3. **Test in IdeaI Context**

   ```bash
   # Start IdeaI dev servers
   pnpm dev

   # Access v0 submodule
   # http://localhost:3000/apps/ideai-designer (unified)
   # or http://localhost:3013 (individual)
   ```

4. **Deploy with IdeaI**
   ```bash
   # Deploy web app (includes v0 submodule)
   ./deploy.sh --prod web
   ```

### v0 as Developer/Designer Tool

**Use Cases**:

1. **UI Component Design**
   - Design components in v0
   - Export to IdeaI
   - Use in `@repo/ui` package

2. **Page Templates**
   - Design page layouts in v0
   - Export to IdeaI apps
   - Align with IdeaI patterns

3. **Animation/Interaction Design**
   - Design animations in v0
   - Export to IdeaI
   - Use in IdeaI apps

4. **Rapid Prototyping**
   - Prototype features in v0
   - Export to IdeaI
   - Refine with IdeaI standards

**Workflow**:

```
v0 Design → IdeaI Alignment → Integration → Testing → Deployment
```

---

## Deployment Configuration

### Vercel Settings

**Main Project**: `web`

**Root Directory**: `apps/web`

**Include files outside root**: ✅ Enabled

**Build Command**: `pnpm build` (from repo root)

**Install Command**: `pnpm install` (from repo root)

**Environment Variables**:

```env
NEXT_PUBLIC_IDEAI_APP_MODE=unified
NEXT_PUBLIC_VERCEL_PROJECT_NAME=web
```

### Git Submodule Configuration

Ensure `.gitmodules` includes submodule:

```ini
[submodule "apps/ideai-designer"]
  path = apps/ideai-designer
  url = https://github.com/ideai-dev-000/ideai-designer.git
```

### Deployment Script

Update `deploy.sh` to handle submodules:

```bash
# Before deployment, update submodules
git submodule update --init --recursive

# Deploy web app (includes submodules)
./deploy.sh --prod web
```

---

## Benefits of Integrated Approach

### ✅ Works Within IdeaI

- v0 apps are part of IdeaI monorepo
- Share same libraries and dependencies
- Consistent with IdeaI architecture

### ✅ Shared Libraries

- Use `@repo/ui` components
- Same Next.js 16, React 19
- No duplicate dependencies

### ✅ Developer/Designer Tool

- v0 helps with front-end design
- Rapid prototyping
- Component generation

### ✅ Unified Deployment

- One deployment for all apps
- Same domain
- Simpler management

### ✅ Parent-Child Architecture

- Aligns with IdeaI patterns
- Clear hierarchy
- Consistent with other child apps

---

## Migration from Separate Deployment

If currently using separate deployment:

1. **Update package.json** (use workspace dependencies)
2. **Create .ideai.json** (child app config)
3. **Update parent app** (add to childApps)
4. **Align components** (use @repo/ui)
5. **Update CSS** (centralized imports)
6. **Test integration** (local dev)
7. **Deploy as part of web** (unified deployment)

---

## Troubleshooting

### Issue: Submodule Not Included in Build

**Solution**: Ensure Git submodule is initialized

```bash
git submodule update --init --recursive
```

### Issue: @repo/ui Not Found

**Solution**: Install workspace dependencies

```bash
pnpm install
```

### Issue: Port Conflicts

**Solution**: Assign unique port in `.ideai.json`

```json
{
  "localPort": 3013
}
```

### Issue: CSS Conflicts

**Solution**: Use centralized CSS imports

```css
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";
```

---

## Success Criteria

Integrated deployment is successful when:

- [ ] v0 submodule accessible at `/apps/ideai-designer`
- [ ] Uses `@repo/ui` shared components
- [ ] Shares same libraries (Next.js 16, React 19)
- [ ] Works in both unified and individual modes
- [ ] Deploys as part of `web` app
- [ ] Aligned with IdeaI standards
- [ ] Acts as developer/designer tool

---

## Related Documentation

- **`docs/development/submodule-development-workflow.md`**: v0 → IdeaI alignment process
- **`docs/architecture/parent-child-complete.md`**: Parent-child architecture guide
- **`docs/architecture/ideai-config.md`**: `.ideai.json` configuration
- **`docs/deployment/unified-deployment.md`**: Unified deployment guide

---

**Last Updated**: January 3, 2026  
**Status**: Recommended Strategy  
**Next Step**: Implement integration (Steps 1-6)
