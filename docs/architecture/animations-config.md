---
title: Animation Libraries Configuration
description: Configure which animation libraries are available in each app
---

# Animation Libraries Configuration

The IdeaI animations system is **fully config-driven**. Each app can specify which animation libraries are available via `.ideai.json`.

## Overview

The animations showcase dynamically displays only the animation libraries configured in `.ideai.json`. If a library is not listed, it won't load or appear in the showcase.

## Configuration

Add `animationLibraries` to your `.ideai.json` file:

```json
{
  "role": "parent",
  "name": "IdeaI",
  "animationLibraries": [
    "framer-motion",
    "react-spring"
  ]
}
```

### Available Libraries

- **`framer-motion`** - React Fiber-based animations with declarative API
- **`react-spring`** - Physics-based animations with natural motion

## How It Works

1. **Config Reading**: The animations showcase reads `.ideai.json` to determine available libraries
2. **Dynamic Loading**: Only configured libraries are loaded and displayed
3. **Filter Toggle**: Users can filter by available libraries using the toggle group
4. **No Bloat**: Libraries not in config are never loaded, reducing bundle size

## Example Configurations

### Full Animation Support

```json
{
  "animationLibraries": [
    "framer-motion",
    "react-spring"
  ]
}
```

### Framer Motion Only

```json
{
  "animationLibraries": [
    "framer-motion"
  ]
}
```

### React Spring Only

```json
{
  "animationLibraries": [
    "react-spring"
  ]
}
```

### No Animations

```json
{
  "animationLibraries": []
}
```

If `animationLibraries` is omitted or empty, the animations showcase will show a message indicating no libraries are configured.

## Default Behavior

- **Web app**: Defaults to `["framer-motion", "react-spring"]` if not specified
- **Other apps**: Defaults to empty array `[]` if not specified

## Benefits

1. **Bundle Size**: Only load what you need
2. **Performance**: No unnecessary library code
3. **Flexibility**: Easy to enable/disable per app
4. **Consistency**: Config-driven approach matches IdeaI architecture

## Implementation Details

The animations showcase component:
- Reads config via `readIdeAIConfigSync()`
- Filters available libraries based on `animationLibraries` array
- Only loads examples for configured libraries
- Shows appropriate message if no libraries configured

## Related Documentation

- [IdeaI Config System](./ideai-config.md) - General config system
- [Animations Architecture](./animations.md) - Animation system architecture

