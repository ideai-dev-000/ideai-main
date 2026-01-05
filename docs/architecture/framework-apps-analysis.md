# Framework Apps Analysis & Unification Strategy

## Current State: Framework Showcase Apps

### Framework Apps Overview

The IdeaI monorepo contains **8 framework showcase apps** that demonstrate different CSS frameworks:

| App         | Port | Framework          | Purpose                                        |
| ----------- | ---- | ------------------ | ---------------------------------------------- |
| `tailwind`  | 3005 | Tailwind CSS       | Utility-first CSS framework demo               |
| `allcss`    | 3006 | MVP.css + Tailwind | Complete styling stack demo                    |
| `bootstrap` | 3007 | Bootstrap          | Component-based CSS framework demo             |
| `unocss`    | 3008 | UnoCSS             | Atomic CSS engine demo                         |
| `shadcn`    | 3009 | Shadcn/UI          | Component library showcase (built on Tailwind) |
| `material`  | 3010 | Material UI        | Material Design components demo                |
| `chakra`    | 3011 | Chakra UI          | Chakra UI components demo                      |
| `radix`     | 3012 | Radix UI           | Radix UI primitives demo                       |

### Key Differences

#### 1. **CSS Framework Only**

- Each app showcases ONE CSS framework
- Frameworks are **mutually exclusive** (no mixing)
- Each has its own `globals.css` with framework-specific imports

#### 2. **Code Structure (Nearly Identical)**

All framework apps have **identical structure**:

- Same `page.tsx` structure (only framework name/description differs)
- Same components: `IdeAIPageTemplate`, `IdeAICSSSummary`, `UF`, `IdeAIHTMLTest`
- Same layout structure
- Same dependencies (except framework-specific packages)

#### 3. **Only Real Differences**

**CSS Imports** (`globals.css`):

- `tailwind`: `@tailwind base/components/utilities`
- `bootstrap`: `@import "bootstrap/dist/css/bootstrap.min.css"`
- `shadcn`: `@import "../../../packages/ui/src/styles/globals.css"` (Tailwind-based)
- `unocss`: UnoCSS configuration
- `material/chakra/radix`: Framework-specific CSS

**Package Dependencies**:

- `bootstrap`: Has `bootstrap` package
- Others: Only `@repo/ui`, `next`, `react`, `react-dom`

**Framework Description**:

- Each has different text in `IdeAICSSSummary` component

### Current Problems

1. **Code Duplication**: 8 nearly identical apps with 95% duplicate code
2. **Maintenance Burden**: Changes to structure require updates in 8 places
3. **Resource Waste**: 8 separate Next.js instances, 8 separate builds
4. **Not Aligned with Shared Codebase Vision**: Should be one unified showcase

## Unification Strategy

### Option A: Single Unified Framework Showcase App (Recommended)

**Create**: `apps/framework-showcase` (or `apps/frameworks`)

**Structure**:

```
apps/framework-showcase/
├── app/
│   ├── [framework]/
│   │   └── page.tsx          # Dynamic route for each framework
│   ├── page.tsx              # Framework selector/index
│   └── globals.css           # Conditional CSS loading
├── lib/
│   ├── frameworks.ts         # Framework configurations
│   └── framework-loader.tsx  # Dynamic framework component loader
└── .ideai.json
```

**How It Works**:

1. Single app with dynamic routes: `/frameworks/tailwind`, `/frameworks/bootstrap`, etc.
2. Framework selector page shows all available frameworks
3. Each route loads the appropriate CSS framework dynamically
4. All frameworks share the same component code
5. CSS loaded conditionally based on route parameter

**Benefits**:

- ✅ Single codebase for all frameworks
- ✅ One Next.js instance, one build
- ✅ Easy to add new frameworks (just add config)
- ✅ Aligns with shared codebase vision
- ✅ Reduces maintenance burden by 87.5% (8 apps → 1 app)

**Implementation**:

```typescript
// app/[framework]/page.tsx
export default function FrameworkPage({ params }: { params: { framework: string } }) {
  const framework = getFrameworkConfig(params.framework);

  return (
    <IdeAIPageTemplate siteName={`IdeaI /${framework.name}`}>
      <IdeAICSSSummary frameworks={[framework.name]} description={framework.description} />
      <UF framework={framework.id} />
      <IdeAIHTMLTest />
    </IdeAIPageTemplate>
  );
}
```

### Option B: Keep Separate Apps, Extract to Package

**Create**: `packages/framework-showcase`

**Structure**:

- Extract common code to `@repo/framework-showcase` package
- Each app becomes thin wrapper importing from package
- Still 8 apps, but shared code

**Benefits**:

- ✅ Shared code in package
- ✅ Each framework still has its own app/route

**Drawbacks**:

- ❌ Still 8 separate apps
- ❌ Still 8 separate builds
- ❌ Doesn't fully solve the problem

### Option C: Component-Based (True Unified Mode)

**Create**: Framework showcase as React components in `@repo/ui`

**Structure**:

- `packages/ui/src/components/framework-showcase/`
- Each framework is a component variant
- Main app imports and uses components

**Benefits**:

- ✅ True unified mode (component imports)
- ✅ No separate apps needed
- ✅ Can be used in any app

**Drawbacks**:

- ❌ More complex CSS loading (need dynamic CSS injection)
- ❌ Framework conflicts if multiple loaded

## Recommended Approach: Option A

**Single Unified Framework Showcase App** is the best solution because:

1. **Eliminates Duplication**: One codebase instead of 8
2. **Easier Maintenance**: Changes in one place
3. **Better Performance**: One build, one instance
4. **Aligns with Vision**: Shared codebase architecture
5. **Scalable**: Easy to add new frameworks
6. **User-Friendly**: Framework selector page for easy navigation

### Migration Plan

1. **Create** `apps/framework-showcase` app
2. **Implement** dynamic routing for frameworks
3. **Move** framework-specific CSS to conditional loading
4. **Test** all frameworks work in unified app
5. **Deprecate** old framework apps (keep for reference, remove from parent config)
6. **Update** navigation to point to unified showcase

### Framework Configuration

```typescript
// lib/frameworks.ts
export const frameworks = {
  tailwind: {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    css: "tailwind",
    port: 3005, // For reference
  },
  bootstrap: {
    id: "bootstrap",
    name: "Bootstrap",
    description: "Component-based CSS framework",
    css: "bootstrap",
    port: 3007,
  },
  // ... etc
};
```

## Next Steps

1. ✅ Document current state (this file)
2. ⏳ Create unified framework showcase app
3. ⏳ Implement dynamic framework routing
4. ⏳ Test all frameworks in unified app
5. ⏳ Update parent app config to use unified showcase
6. ⏳ Archive old framework apps (keep for reference)

## Related

- [Shared Codebase Architecture TODO](TODOS.md#true-unified-mode-shared-codebase-architecture)
- [Unified vs Individual Mode](docs/architecture/unified-vs-individual-mode.md)
- [CSS Compatibility](docs/architecture/parent-child-css.md)
