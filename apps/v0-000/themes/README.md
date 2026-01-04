# Theme System

**Themes work independently of UI components via CSS variables.**

## 🎨 How It Works

1. **Themes are defined** in `themes/*.ts` files
2. **CSS variables are set** dynamically based on selected theme
3. **UI components automatically adapt** - no code changes needed
4. **Works with v0** - just define colors, components use them

## 📁 Theme Structure

```typescript
export const myTheme = {
  name: "my-theme",
  displayName: "My Theme",
  colors: {
    // Light mode colors
    primary: "hsl(...)",
    secondary: "hsl(...)",
    // ... all color tokens
  },
  dark: {
    // Dark mode colors
    primary: "hsl(...)",
    secondary: "hsl(...)",
    // ... all color tokens
  },
};
```

## 🎯 Color Tokens

All themes must define these tokens:
- `primary`, `primaryForeground`
- `secondary`, `secondaryForeground`
- `muted`, `mutedForeground`
- `accent`, `accentForeground`
- `destructive`, `destructiveForeground`
- `border`, `input`, `ring`
- `background`, `foreground`
- `card`, `cardForeground`

## ✅ Creating a New Theme

1. Create `themes/my-theme.ts`
2. Export theme object with `name`, `displayName`, `colors`, `dark`
3. Add to `themes/index.ts` registry
4. Theme is immediately available!

## 🔄 How Components Use Themes

Components don't need to know about themes:

```tsx
// Component code - no theme awareness needed
<Button className="bg-primary text-primary-foreground">
  Click me
</Button>
```

The `bg-primary` class uses CSS variable `--primary`, which is set by the theme system.

## 🚀 For v0

When creating components in v0:
- Use standard Tailwind color classes (`bg-primary`, `text-foreground`, etc.)
- Don't hardcode colors
- Themes will automatically apply
- Create new themes by just defining colors

---

**Themes are completely independent of UI components!**

