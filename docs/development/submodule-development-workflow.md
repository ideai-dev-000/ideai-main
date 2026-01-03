# Submodule Development Workflow: v0 → IdeaI Alignment

**Version**: 1.0.0  
**Last Updated**: January 3, 2026  
**Purpose**: Guide for developing submodules in v0 while maintaining IdeaI standards

---

## Overview

IdeaI uses Git submodules to integrate external projects (like `apps/ideai-designer`) that are developed in v0. This document defines the workflow for:

1. **Developing** submodules in v0 (external tool)
2. **Aligning** v0 code with IdeaI standards
3. **Syncing** changes back to IdeaI monorepo
4. **Maintaining** IdeaI compliance during development

---

## The Challenge

### Context

- **Submodules are developed in v0**: External tool generates code
- **Must maintain IdeaI standards**: Naming, patterns, architecture
- **Sync workflow needed**: v0 → IdeaI alignment process
- **Team coordination**: Multiple developers need clear guidelines

### Current Submodules

1. **`apps/ideai-designer`**
   - Repository: https://github.com/ideai-dev-000/ideai-designer.git
   - Developed in: v0
   - Status: Synced with v0 (commit: `0b3751be63683d1f7d3a7c013f0ce22dad601e5f`)
   - **Note**: Requires IdeaI alignment after v0 development

2. **`tools/code-context`**
   - Repository: https://github.com/ideai-dev/ideai-codecontext.git
   - Developed in: Kotlin/Gradle (separate stack)
   - Status: Local development only

---

## IdeaI Standards Checklist

Before syncing v0 code to IdeaI, ensure compliance with these standards:

### 1. Brand and Naming Standards

#### Brand Name: IdeaI

- ✅ **CRITICAL**: Always use **IdeaI** (capital I, lowercase dea, capital I)
- ❌ Never: `IDEAI`, `Ideai`, `ideai`, `IDEAi`, `Idea I`
- **Check**: All UI text, documentation, code comments

#### Semantic File Naming

- ✅ Use kebab-case: `user-profile-card.tsx`, `api-auth-handler.ts`
- ✅ Be descriptive and specific
- ✅ Include purpose/type in name
- ❌ Never: `component1.tsx`, `utils.ts`, `file.md`, `temp.js`

#### UniFrame (UF) Naming

- **Brand name**: "UniFrame" (capital U, capital F)
- **File names**: `uf.tsx`, `uf-code-viewer.tsx` (kebab-case with "uf-" prefix)
- **Component names**: `UF`, `UFCodeViewer`, `UFCard` (PascalCase with "UF" prefix)
- **CSS classes**: `uf-container`, `uf-card` (kebab-case with "uf-" prefix)

### 2. Code Standards

#### Code Headers

All code files must include:

```typescript
/**
 * @fileoverview Brief description
 * @module ModuleName
 * @description Detailed explanation
 * @example Usage examples
 * @see Related files
 * @todo Known issues or improvements
 */
```

#### Code Quality

- ✅ TypeScript strict mode
- ✅ All functions typed
- ❌ No `any` types
- ✅ Error handling for async operations
- ✅ Comments for complex logic

#### No Legacy Support

- ❌ NO legacy file format support
- ❌ NO backward compatibility code
- ✅ ONLY current formats
- ✅ Future-focused (2026+ best practices)

### 3. Architecture Standards

#### Composability and Parent-Child Semantics

- ✅ Components must be composable
- ✅ Clear parent-child relationships
- ✅ Use UniFrame structure: wrapper → header/body/footer → content
- ✅ Follow existing patterns from `@repo/ui`
- ❌ Monolithic components that can't be broken down

#### Naming Patterns

- **Scripts**: `ideai-[parent]-[child].mjs`
- **Components**: `[parent]-[child].tsx`
- **Directories**: `[parent]/[child]/`

**Example**:

- ✅ `ideai-build-verify.mjs`
- ✅ `uf-card-header.tsx`
- ✅ `uf-card/uf-header/`
- ❌ `build.ts`, `component1.tsx`, `utils/`

### 4. UI Consistency Standards

#### Centralized CSS Architecture

- ✅ Import from `@repo/ui/src/styles/globals.css`
- ✅ Import from `@repo/ui/src/styles/ideai.css`
- ❌ NO custom CSS in apps (only app-specific layout adjustments)
- ✅ Use standard Tailwind classes + CSS variables from `ideai.css`

#### Import Pattern (MANDATORY)

```css
/* In apps/*/app/globals.css */
@import "../../../packages/ui/src/styles/globals.css";
@import "../../../packages/ui/src/styles/ideai.css";
```

### 5. Documentation Standards

#### File Organization

- ✅ All documentation in `docs/` directory
- ✅ Semantic naming: kebab-case
- ❌ NO MD files in root (except README.md, SECURITY.md, .ideai-rules.md)
- ❌ NO temporary files in root

#### Accuracy Requirements

- ✅ 100% accuracy - all information current
- ✅ All code examples tested and working
- ✅ All file paths verified
- ✅ All links tested and working

---

## v0 → IdeaI Alignment Process

### Step 1: Develop in v0

1. **Create/Edit in v0**
   - Use v0 to generate or modify code
   - Focus on functionality first
   - Don't worry about IdeaI standards yet

2. **Export from v0**
   - Get the generated code
   - Note any v0-specific patterns or conventions

### Step 2: IdeaI Alignment Checklist

After getting code from v0, apply IdeaI standards:

#### File-Level Alignment

- [ ] **Rename files** to semantic kebab-case
  - ❌ `Component1.tsx` → ✅ `logo-preview-card.tsx`
  - ❌ `utils.ts` → ✅ `animation-utils.ts`

- [ ] **Add code headers** to all files
  - Include @fileoverview, @module, @description, @example, @see, @todo

- [ ] **Fix TypeScript types**
  - Remove all `any` types
  - Add proper type definitions
  - Ensure strict mode compliance

#### Component-Level Alignment

- [ ] **Apply parent-child naming**
  - Components: `[parent]-[child].tsx`
  - Example: `logo-preview-card.tsx`, `logo-preview-header.tsx`

- [ ] **Ensure composability**
  - Break down monolithic components
  - Use wrapper → header/body/footer → content pattern
  - Make components reusable

- [ ] **Update imports**
  - Use `@repo/ui` for shared components
  - Use centralized CSS imports
  - Remove duplicate utilities

#### Brand Alignment

- [ ] **Replace brand references**
  - Find: `IDEAI`, `Ideai`, `ideai`, etc.
  - Replace: `IdeaI` (exact capitalization)

- [ ] **Update package.json**
  - Change `"name": "my-v0-project"` → `"name": "@ideai/ideai-designer"`
  - Update description to mention IdeaI
  - Add IdeaI-specific metadata

#### CSS Alignment

- [ ] **Update globals.css**
  - Remove custom CSS (if not app-specific layout)
  - Add centralized CSS imports:
    ```css
    @import "../../../packages/ui/src/styles/globals.css";
    @import "../../../packages/ui/src/styles/ideai.css";
    ```
  - Use standard Tailwind classes + CSS variables

#### Documentation Alignment

- [ ] **Update README.md**
  - Mention IdeaI integration
  - Update file paths to match IdeaI structure
  - Add IdeaI-specific usage examples

- [ ] **Add/update code comments**
  - Use IdeaI brand name correctly
  - Reference IdeaI patterns where applicable

### Step 3: Sync to IdeaI

1. **Commit to submodule repository**

   ```bash
   cd apps/ideai-designer
   git add .
   git commit -m "feat: align with IdeaI standards

   - Applied semantic file naming
   - Added code headers
   - Fixed TypeScript types
   - Updated brand references to IdeaI
   - Aligned with IdeaI architecture patterns

   Related: TICKET-XXX"
   git push origin main
   ```

2. **Update submodule reference in IdeaI**

   ```bash
   cd /path/to/ideai-main
   git submodule update --remote apps/ideai-designer
   git add .gitmodules apps/ideai-designer
   git commit -m "chore(submodules): update ideai-designer to IdeaI-aligned version

   Updated ideai-designer submodule with IdeaI standards compliance:
   - Semantic file naming applied
   - Code headers added
   - TypeScript types fixed
   - Brand references updated

   Related: TICKET-XXX"
   ```

3. **Verify integration**

   ```bash
   # Build to ensure no errors
   pnpm build

   # Run dev server to test
   pnpm dev

   # Check for IdeaI standards compliance
   # (manual review or automated check)
   ```

---

## Development Workflow

### Daily Development Cycle

1. **Morning: Pull latest**

   ```bash
   # In IdeaI monorepo
   git submodule update --remote apps/ideai-designer
   ```

2. **Develop in v0**
   - Create/modify code in v0
   - Export generated code

3. **Align with IdeaI standards**
   - Run through IdeaI Alignment Checklist
   - Apply all required changes

4. **Test locally**

   ```bash
   # In submodule directory
   cd apps/ideai-designer
   pnpm dev
   # Test functionality
   ```

5. **Commit and sync**
   - Commit to submodule repo
   - Update IdeaI monorepo reference
   - Push both repositories

### Weekly Alignment Review

Every week, review submodule for:

- [ ] New files added - check naming compliance
- [ ] New components - check parent-child patterns
- [ ] CSS changes - check centralized architecture
- [ ] Documentation - check accuracy and organization
- [ ] Brand references - check IdeaI capitalization
- [ ] TypeScript types - check for `any` types
- [ ] Code headers - check all files have headers

### Pre-Deployment Alignment

Before deploying submodule:

1. **Full IdeaI Standards Audit**
   - Run complete checklist
   - Fix all violations
   - Document any exceptions (with justification)

2. **Build Verification**

   ```bash
   pnpm build
   pnpm lint
   pnpm check-types
   ```

3. **Documentation Verification**

   ```bash
   node scripts/ideai-build.mjs verify --docs
   ```

4. **Integration Testing**
   - Test submodule in IdeaI monorepo context
   - Verify no conflicts with main apps
   - Check shared dependencies

---

## Guidelines and Best Practices

### Do's ✅

1. **Always align before syncing**
   - Never sync raw v0 code directly
   - Always apply IdeaI standards first

2. **Use semantic names from the start**
   - When possible, guide v0 to generate semantic names
   - Rename immediately after export if needed

3. **Maintain parent-child patterns**
   - Structure components with clear hierarchy
   - Use established patterns from `@repo/ui`

4. **Keep documentation current**
   - Update README.md with IdeaI context
   - Add code comments referencing IdeaI patterns

5. **Test in IdeaI context**
   - Always test submodule within IdeaI monorepo
   - Verify integration with shared packages

### Don'ts ❌

1. **Don't skip alignment**
   - Raw v0 code will not meet IdeaI standards
   - Skipping alignment creates technical debt

2. **Don't create new patterns**
   - Use existing IdeaI patterns
   - Follow established conventions

3. **Don't duplicate code**
   - Use `@repo/ui` for shared components
   - Use centralized CSS, don't create custom styles

4. **Don't use legacy patterns**
   - No backward compatibility code
   - Future-focused only (2026+)

5. **Don't ignore TypeScript**
   - No `any` types
   - Strict mode always

---

## Automation Opportunities

### Future Enhancements

1. **Automated Alignment Script**
   - Script to check IdeaI standards compliance
   - Auto-fix common issues (file naming, headers)
   - Report violations for manual review

2. **Pre-commit Hooks**
   - Check IdeaI standards before commit
   - Block commits with violations
   - Suggest fixes

3. **CI/CD Integration**
   - Automated standards checking in CI
   - Build verification
   - Documentation verification

4. **Alignment Templates**
   - Templates for common v0 → IdeaI transformations
   - Code snippets for standard patterns
   - Quick reference guides

---

## Troubleshooting

### Common Issues

#### Issue: File naming violations

**Solution**: Rename files to semantic kebab-case immediately after v0 export

#### Issue: Missing code headers

**Solution**: Add headers template to all files. Consider script to auto-add.

#### Issue: TypeScript `any` types

**Solution**: Replace with proper types. Use IdeaI type definitions where available.

#### Issue: Brand name inconsistencies

**Solution**: Use find/replace: `IDEAI|Ideai|ideai` → `IdeaI` (case-sensitive)

#### Issue: CSS conflicts

**Solution**: Remove custom CSS, use centralized imports from `@repo/ui`

#### Issue: Component structure violations

**Solution**: Refactor to parent-child patterns. Use UniFrame structure.

---

## Related Documentation

- **`.ideai-rules.md`**: Complete IdeaI development standards
- **`docs/architecture/`**: Architecture patterns and design standards
- **`docs/HANDOVER-NOTE.md`**: Current project status and priorities
- **`scripts/TODOS.md`**: All pending tasks

---

## Success Criteria

A submodule is considered IdeaI-aligned when:

- [ ] All files use semantic kebab-case naming
- [ ] All files have complete code headers
- [ ] No TypeScript `any` types
- [ ] All brand references use "IdeaI" (exact capitalization)
- [ ] Components follow parent-child patterns
- [ ] CSS uses centralized architecture
- [ ] Documentation is accurate and current
- [ ] Build passes without errors
- [ ] Integration tests pass
- [ ] Standards compliance verified

---

**Last Updated**: January 3, 2026  
**Next Step**: Research submodule deployment strategy (second priority task)
