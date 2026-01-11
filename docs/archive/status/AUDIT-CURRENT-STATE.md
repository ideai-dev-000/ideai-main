# IdeaI Codebase Audit - Current State

**Date**: 2026-01-11  
**Purpose**: Comprehensive audit of what's working, what isn't, and legacy code concerns

---

## ✅ WHAT'S WORKING

### 1. **Dev Servers - ALL RUNNING**

- ✅ Port 3000: Main web app (HTTP 200)
- ✅ Port 3018: Capabilities app (HTTP 200)
- ✅ Port 3020: VibeCoder app (HTTP 200)

**Status**: All apps operational after fresh restarts

---

### 2. **Dev Setup System - COMPLETE**

**Status**: ✅ Fully Implemented & Ready for Testing

**Components**:

- DevSetupModal: Auto-appears on sign-in
- Migration streaming: Real-time logs via SSE
- Setup checker: Validates DB, auth, keys, env vars
- Status persistence: `.ideai-dev.json` tracking

**Files**:

- `apps/ideai-capabilities/components/dev-setup-modal.tsx`
- `apps/ideai-capabilities/app/api/dev-setup/check/route.ts`
- `apps/ideai-capabilities/app/api/dev-setup/migrate/route.ts`
- `apps/ideai-capabilities/app/api/dev-setup/migrate/stream/route.ts`

**Current State**:

- ✅ Code complete
- ⏳ **NEEDS TESTING** - Not yet verified end-to-end

---

### 3. **Database Management APIs - CREATED**

**Status**: ✅ APIs Implemented, UI Integration Pending

**APIs**:

- `POST /api/database/push` - Push schema (local)
- `POST /api/database/sync` - Sync schema (production ↔ local)

**Current State**:

- ✅ Backend ready
- ⏳ **UI NOT CONNECTED** - Need to wire to DB Manager UI

---

### 4. **Key Management System - COMPLETE**

**Status**: ✅ Fully Operational

**Features**:

- Centralized encrypted storage
- Local/Production separation
- CLI sync tool (`pnpm key-sync`)
- Hash-based validation
- UI management page

**Current State**: ✅ Working

---

### 5. **Documentation - COMPREHENSIVE**

**Status**: ✅ Up to Date

**Documents**:

- `docs/development/DEVELOPER-SETUP-COMPLETE.md` (413 lines)
- `docs/development/NEXT-STEPS-FOR-DEVS.md`
- `docs/HANDOVER-CURRENT-SESSION.md`
- `docs/development/ideai-file-distinction.md`

**Current State**: ✅ Complete & accurate

---

## ⚠️ WHAT NEEDS ATTENTION

### 1. **Legacy Code - CONFIRMED CONCERNS** 🚨

#### Legacy Action Mappings

**File**: `apps/ideai-capabilities/plugins/legacy-mappings.ts`

**Status**: ⚠️ ACTIVE LEGACY CODE

**Details**:

- Maps old action labels → new namespaced IDs
- Used in `discover-plugins.ts` and `registry.ts`
- Task exists: `legacy-mappings-cleanup` (medium priority, pending)

**Usage**:

- `scripts/discover-plugins.ts`: Imports and uses for backward compatibility
- `plugins/registry.ts`: Uses for legacy label support
- `lib/utils/template.ts`: Processes legacy $ references
- `lib/workflow-codegen-sdk.ts`: Handles legacy dollar references
- Multiple components support legacy labels

**Action Required**:

- ⏳ Migrate all workflows to new format
- ⏳ Remove legacy support code
- ⏳ Update task status when complete

---

#### Legacy Code References Found

1. **Legacy Dollar References** (`$nodeId`)
   - `lib/utils/template.ts`: `processLegacyDollarReference()`
   - `lib/workflow-codegen-sdk.ts`: `processLegacyDollarRef()`
   - **Status**: Still supported, needs migration

2. **Legacy Label References**
   - `lib/utils/template.ts`: `processLegacyLabelReference()`
   - Multiple components: Fallback to legacy labels
   - **Status**: Active backward compatibility

3. **Legacy Base64 Image Detection**
   - `components/workflow/workflow-runs.tsx`
   - **Status**: Fallback support still present

4. **Deprecated Function**
   - `lib/db/queries.ts`: `createUser()` marked deprecated
   - **Status**: Comment says "use Better Auth's signUp.email() instead"

5. **Legacy Model Support**
   - `plugins/ai-gateway/index.ts`: "Legacy models (kept for backwards compatibility)"
   - **Status**: Still in code

---

### 2. **Temporary Files**

**Found**:

- `apps/ideai-capabilities/app/.well-known/workflow/v1/step/route.js.debug.json.*.tmp`

**Action**: Clean up temp files (should be in `.gitignore`)

---

### 3. **Build Cache Size**

**Current**: 487MB in `apps/ideai-capabilities/.next`

**Concern**: Large cache may indicate:

- Unnecessary build artifacts
- Should use centralized cache (task exists but pending)

**Task**: `centralized-cache` (medium priority, pending)

---

### 4. **TODO Comments in Code**

**Found**:

- `lib/workflow-codegen.ts`: "TODO: Implement action type"
- `scripts/discover-plugins.ts`: Uses legacy mappings
- Multiple files: Legacy support comments

**Policy Violation**: TODOs should be in `tasks.json`, not code comments

---

## 🚨 LEGACY CODE BUILDUP - RISK ASSESSMENT

### Risk Level: **MEDIUM** ⚠️

**Why**:

1. **Active Legacy Support**: Legacy mappings are actively used
2. **Backward Compatibility**: Multiple fallback paths for old formats
3. **Migration Incomplete**: No clear migration path documented
4. **Policy Violation**: Against "No Legacy Support" policy in `.cursorrules`

**Current Legacy Items**:

1. ✅ Legacy action mappings (tracked in tasks.json)
2. ⚠️ Legacy dollar references ($nodeId)
3. ⚠️ Legacy label references
4. ⚠️ Legacy base64 image detection
5. ⚠️ Deprecated `createUser()` function
6. ⚠️ Legacy model support in AI Gateway

**Impact**:

- Code complexity (backward compatibility logic)
- Maintenance burden (multiple code paths)
- Technical debt accumulation
- Policy inconsistency

---

## 📋 WHAT'S PENDING (From Tasks)

### High Priority Tasks

1. **Test Migration System** ⚠️ CRITICAL
   - Dev setup system complete but **untested**
   - Real-time streaming not verified
   - Migration tracking not validated

2. **DB Manager UI Integration**
   - APIs created but not connected to UI
   - Push/pull/sync buttons need wiring

3. **Legacy Mappings Cleanup** (Medium Priority)
   - File exists and is actively used
   - Migration strategy needed
   - Should follow "No Legacy Support" policy

### Medium Priority

- Unified mode package extraction
- Submodule deployment strategy
- Build system enhancements
- Documentation updates

---

## 🎯 CURRENT FOCUS AREA

### **Dev Setup System** (What We Just Built)

**Completed**:

- ✅ Real-time migration streaming
- ✅ Setup checker
- ✅ Modal UI
- ✅ Database APIs
- ✅ Documentation

**Next Steps**:

1. ⏳ **TEST EVERYTHING** - Critical gap
2. ⏳ Connect DB Manager UI
3. ⏳ Verify end-to-end workflow

---

## 📊 CODEBASE HEALTH METRICS

### Build Status

- ✅ All apps compile
- ✅ No TypeScript errors
- ✅ ESLint passing
- ⚠️ 487MB cache in capabilities app

### Server Status

- ✅ All 3 main apps running
- ✅ HTTP 200 on all ports
- ✅ Fresh restarts successful

### Code Quality

- ✅ TypeScript strict mode
- ✅ Proper error handling
- ⚠️ Legacy code present (against policy)
- ⚠️ Some TODO comments in code (should be in tasks.json)

---

## 🔍 SPECIFIC CONCERNS

### 1. **Legacy Mappings File**

**Location**: `apps/ideai-capabilities/plugins/legacy-mappings.ts`

**Status**:

- ✅ Tracked in tasks.json
- ⚠️ Still actively imported/used
- ⏳ No migration plan documented

**Risk**: Medium - Creates technical debt, violates policy

### 2. **Build Cache**

**Size**: 487MB (capabilities app alone)

**Concern**:

- Task exists for centralized cache
- Multiple apps = multiple caches
- Disk space waste

**Risk**: Low - Functional, but inefficient

### 3. **Temporary Files**

**Found**: Debug temp file in `.well-known` directory

**Action**: Should be cleaned up

**Risk**: Very Low - Cosmetic issue

---

## ✅ RECOMMENDATIONS

### Immediate (This Week)

1. **Test dev setup system end-to-end**
   - Click migration button
   - Verify streaming works
   - Confirm `.ideai-dev.json` updates

2. **Connect DB Manager UI**
   - Wire up push/pull/sync buttons
   - Test schema operations

### Short Term (Next Sprint)

1. **Document legacy migration strategy**
   - How to migrate workflows
   - Timeline for removal
   - Update tasks.json

2. **Clean up temp files**
   - Remove debug temp files
   - Verify `.gitignore` coverage

### Medium Term (Next Month)

1. **Address legacy code**
   - Complete workflow migrations
   - Remove legacy mappings
   - Clean up backward compatibility code

2. **Implement centralized cache**
   - Reduce disk usage
   - Improve build performance

---

## 📝 SUMMARY

### What's Good ✅

- All servers running
- Dev setup system complete
- Key management working
- Documentation comprehensive
- Recent commits show active development

### What Needs Work ⚠️

- **Testing**: Dev setup system untested
- **Legacy Code**: Active backward compatibility (policy violation)
- **UI Integration**: DB Manager APIs not connected
- **Cache Management**: Large, unoptimized caches

### Legacy Code Risk: **MEDIUM** ⚠️

- Legacy mappings actively used
- Multiple fallback paths
- Against "No Legacy Support" policy
- Tracked in tasks but no migration plan

### Overall Health: **GOOD** ✅

- Functional systems
- Active development
- Clear documentation
- Some technical debt (manageable)

---

**Next Action**: Test dev setup system, then address legacy code migration strategy.
