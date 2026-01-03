# IdeaI Monorepo - Team Handover Note

**Date**: January 3, 2026  
**Status**: Ready for Next Phase  
**Current Branch**: `004---Ramping-up-via-VO-and-Templates-from-Vercel`

---

## 🎯 Current Status

### ✅ Completed

1. **Build System**: All 13 apps build successfully
2. **Dev Servers**: All 13 apps running locally (ports 3000-3012)
3. **Submodules**:
   - `apps/ideai-designer` converted to proper git submodule
   - Synced with v0 (commit: `0b3751be63683d1f7d3a7c013f0ce22dad601e5f`)
   - `tools/code-context` already configured as submodule
4. **Code Quality**:
   - Trailing newlines normalized (POSIX compliance)
   - All TypeScript types resolved
   - Memory leak fixes applied (lazy loading)
5. **Documentation**: Rules centralized in `.ideai-rules.md`

### ⚠️ Pending Tasks

1. **Submodule Development Workflow** ✅ **COMPLETED**
   - ✅ Research v0 → IdeaI alignment process
   - ✅ Document submodule development guidelines
   - ✅ Ensure submodules maintain IdeaI standards
   - **Documentation**: `docs/development/submodule-development-workflow.md`

2. **Submodule Deployment Strategy** ✅ **COMPLETED** (Decision: Integrated Approach)
   - ✅ Research and document pros/cons
   - ✅ **Revised Strategy**: Integrated as child app within IdeaI monorepo
   - ✅ **Rationale**: v0 apps work within IdeaI, share libraries, act as developer/designer tool
   - ✅ **Implementation**: Created `.ideai.json`, updated parent app config
   - ⚠️ **Next Step**: Align package.json to use workspace dependencies
   - **Documentation**: `docs/deployment/submodule-deployment-strategy-integrated.md`

3. **Deployment Status**:
   - ✅ 3 apps deployed: `web`, `docs`, `all`
   - ❌ 10 apps not linked: `nocss`, `mvp`, `tailwind`, `allcss`, `bootstrap`, `unocss`, `shadcn`, `material`, `chakra`, `radix`

---

## 📋 Deployment URLs

### Production URLs (Live)

- **web**: https://web-idea-i.vercel.app
- **docs**: https://docs-idea-i.vercel.app
- **all**: https://all-idea-i.vercel.app

### Apps Needing Deployment

The following apps are built and ready but not linked to Vercel:

- `nocss`, `mvp`, `tailwind`, `allcss`, `bootstrap`, `unocss`, `shadcn`, `material`, `chakra`, `radix`

**Action Required**: Link these apps using `node scripts/ideai-develop-vercel-link.mjs <app-name>` then deploy.

---

## 🔧 Development Environment

### Local Dev Servers

All 13 apps are running on:

- `web`: http://localhost:3000
- `docs`: http://localhost:3001
- `all`: http://localhost:3002
- `nocss`: http://localhost:3003
- `mvp`: http://localhost:3004
- `tailwind`: http://localhost:3005
- `allcss`: http://localhost:3006
- `bootstrap`: http://localhost:3007
- `unocss`: http://localhost:3008
- `shadcn`: http://localhost:3009
- `material`: http://localhost:3010
- `chakra`: http://localhost:3011
- `radix`: http://localhost:3012

**Note**: `ideai-designer` submodule is excluded from `pnpm dev` (run separately if needed).

### Commands

```bash
# Start all dev servers
pnpm dev

# Build all apps
pnpm build

# Deploy all apps
./deploy.sh

# Deploy specific app
./deploy.sh web

# Deploy to production
./deploy.sh --prod
```

---

## 📦 Submodules

### Current Submodules

1. **`apps/ideai-designer`**
   - Repository: https://github.com/ideai-dev-000/ideai-designer.git
   - Current commit: `0b3751be63683d1f7d3a7c013f0ce22dad601e5f`
   - Status: Synced with v0
   - **Note**: Developed in v0, must maintain IdeaI alignment

2. **`tools/code-context`**
   - Repository: https://github.com/ideai-dev/ideai-codecontext.git
   - Status: Local development only (not in production builds)

### Submodule Management

```bash
# Update submodule to latest
git submodule update --remote apps/ideai-designer

# Initialize submodules (for new clones)
git submodule update --init --recursive
```

---

## 🚨 Critical Decisions Needed

### 1. Submodule Deployment Strategy

**Question**: How should submodules be deployed to Vercel?

**Option A: Separate Vercel Projects**

- Each submodule gets its own Vercel project
- Independent deployments and URLs
- Pros: Isolation, independent scaling
- Cons: More projects to manage, separate domains

**Option B: Folders in ideai-main**

- Submodules deploy as folders within main project
- Unified deployment and domain
- Pros: Single project, unified domain
- Cons: More complex routing, potential conflicts

**Action**: Research, decide, document, implement.

### 2. Submodule Development Workflow

**Question**: How to develop submodules in v0 while maintaining IdeaI alignment?

**Requirements**:

- Submodules developed in v0 (external tool)
- Must maintain IdeaI standards (naming, patterns, architecture)
- Need sync workflow: v0 → IdeaI alignment
- Documentation needed for team

**Action**: Research, document workflow, create guidelines.

---

## 📚 Key Documentation

### Essential Reading

1. **Rules**: `.ideai-rules.md` - Complete IdeaI development standards
2. **Cursor Rules**: `.cursorrules` - Cursor-specific rules (references `.ideai-rules.md`)
3. **TODOs**: `scripts/TODOS.md` - All pending tasks and priorities
4. **Architecture**: `docs/architecture/` - Design patterns and standards

### Important Files

- `.ideai-rules.md`: Single source of truth for all rules
- `scripts/TODOS.md`: Master task list
- `deploy.sh`: Unified deployment script
- `.gitmodules`: Submodule configuration

---

## 🔄 Next Phase Priorities

### Immediate (Do First)

1. **Research submodule development workflow** (v0 → IdeaI alignment)
2. **Decide submodule deployment strategy** (separate projects vs. folders)
3. **Link remaining 10 apps to Vercel** and deploy

### High Priority

1. Automatic submodule updates before build
2. Submodule alignment verification
3. Deployment automation improvements

### See `scripts/TODOS.md` for complete task list

---

## ⚙️ Technical Details

### Build Status

- ✅ All 13 apps build successfully
- ✅ TypeScript types resolved
- ✅ No build errors
- ⚠️ `ideai-designer` excluded from builds (submodule)

### Git Status

- ✅ All changes committed
- ✅ Submodules synced
- 📝 Some uncommitted docs changes (non-critical)

### Disk Space

- ⚠️ Monitor disk space when running all 13 apps
- Use `node scripts/ideai-develop-cleanup-next.mjs` to clean `.next` directories

---

## 🎯 Success Criteria for Next Phase

- [ ] Submodule development workflow documented
- [ ] Submodule deployment strategy decided and implemented
- [ ] All 13 apps deployed to Vercel
- [ ] Automatic submodule updates before build
- [ ] All TODOs in `scripts/TODOS.md` prioritized and assigned

---

## 📞 Support

- **Documentation**: See `docs/` directory
- **Rules**: See `.ideai-rules.md`
- **TODOs**: See `scripts/TODOS.md`
- **Deployment**: See `docs/deployment/`

---

**Last Updated**: January 3, 2026  
**Ready for**: Next development phase
