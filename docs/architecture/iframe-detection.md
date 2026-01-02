# IFrame Detection System

## Overview

The IdeaI IFrame Detection System provides a standard way to detect if a site is viewed in an iframe and control UI element visibility. It supports both compact and verbose URL parameter formats.

## URL Parameter Rules

### Compact Format (Preferred)

**Single-letter codes for efficiency:**

| Code | Parameter | Values | Description |
|------|-----------|--------|-------------|
| `i` | iframe | `0` or `1` | In iframe (1 = yes, 0 = no) |
| `v` | visibility | `0` or `1` | Visibility (0 = hide all, 1 = show all) |
| `h` | header | `0` or `1` | Header (0 = hide, 1 = show) |
| `f` | footer | `0` or `1` | Footer (0 = hide, 1 = show) |
| `n` | nav | `0` or `1` | Nav (0 = hide, 1 = show) |
| `c` | css summary | `0` or `1` | CSS Framework Summary (0 = hide, 1 = show) |
| `u` | uniframe | `0` or `1` | UniFrame demo section (0 = hide, 1 = show) |
| `p` | parent | `<url>` | Parent site URL |
| `b` | brand | `<json>` | Brand config (JSON encoded) |

### Verbose Format (Backward Compatible)

| Parameter | Values | Description |
|-----------|--------|-------------|
| `ideai-iframe` | `true` or `false` | In iframe |
| `ideai-hide-header` | `true` or `false` | Hide header |
| `ideai-hide-footer` | `true` or `false` | Hide footer |
| `ideai-hide-nav` | `true` or `false` | Hide navigation |
| `ideai-parent-url` | `<url>` | Parent site URL |
| `ideai-brand-config` | `<json>` | Brand config (JSON encoded) |

## Examples

### Basic Usage

```html
<!-- In iframe, hide header/footer/nav -->
<iframe src="https://site.com?i=1&h=0&f=0&n=0"></iframe>

<!-- Hide everything (visibility = 0) -->
<iframe src="https://site.com?i=1&v=0"></iframe>

<!-- Hide only header and footer -->
<iframe src="https://site.com?h=0&f=0"></iframe>

<!-- Hide CSS summary and UniFrame (for clean iframe embedding) -->
<iframe src="https://site.com?i=1&c=0&u=0"></iframe>

<!-- Full example with parent URL -->
<iframe src="https://site.com?i=1&h=0&f=0&n=0&c=0&u=0&p=https://parent.com"></iframe>
```

### Auto-Detection

If no parameters are provided, the system auto-detects iframe context:

```html
<!-- Auto-detects iframe and hides header/footer/nav -->
<iframe src="https://site.com"></iframe>
```

### Brand Configuration

```html
<!-- With brand config -->
<iframe src="https://site.com?i=1&b=%7B%22parentSiteName%22%3A%22Parent%22%2C%22childSiteName%22%3A%22Child%22%7D"></iframe>
```

## Default Behavior

- **If in iframe (detected)**: `h=0`, `f=0`, `n=0`, `c=0`, `u=0` (hide header/footer/nav/CSS summary/UniFrame)
- **If not in iframe**: `h=1`, `f=1`, `n=1`, `c=1`, `u=1` (show all)
- **Main content**: Always shown (cannot be hidden)

## Implementation

### Using in Components

```tsx
import { useIFrameContext } from "@repo/ui/lib/iframe-detection";

function MyComponent() {
  const { isInIFrame, hideHeader, hideFooter, hideNav } = useIFrameContext();

  return (
    <>
      {!hideHeader && <Header />}
      <MainContent />
      {!hideFooter && <Footer />}
    </>
  );
}
```

### Using in Page Template

The `IdeAIPageTemplate` component automatically uses iframe detection:

```tsx
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";

export default function Page() {
  return (
    <IdeAIPageTemplate siteName="My Site">
      <YourContent />
    </IdeAIPageTemplate>
  );
}
```

## Value Parsing

The system supports multiple value formats:

- **Numbers**: `0` = false/hide, `1` = true/show
- **Booleans**: `true` = true/show, `false` = false/hide
- **Strings**: `"yes"` = true, `"no"` = false

## Priority

1. Compact format parameters (`i`, `h`, `f`, `n`, `v`)
2. Verbose format parameters (`ideai-*`)
3. Auto-detection (if in iframe, default hide)

## Implementation Details

### Hydration-Safe Design

The iframe detection system is designed to prevent React hydration errors:

- **Server-side**: Always renders with header/footer visible (no `window` object)
- **Client-side**: Detects iframe context after mount using `useEffect`
- **Hiding mechanism**: Uses CSS `display: none` instead of conditional rendering
- **Result**: Same HTML structure on server and client = no hydration mismatches

This ensures stable rendering in all contexts, including iframes embedded in other sites.

## Notes

- Main content is **always shown** - cannot be hidden
- Visibility parameter (`v=0`) overrides individual settings
- Compact format is preferred for efficiency
- Verbose format maintained for backward compatibility
- System is hydration-safe (prevents React hydration errors)

