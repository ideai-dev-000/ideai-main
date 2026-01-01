# IdeaI Brand Assets

Centralized brand assets for all IdeaI applications.

## Files

- `favicon.svg` - Browser favicon (gear icon on yellow background)
- `logo.svg` - Full logo (gear icon + "IdeaI" text)
- `logo-icon.svg` - Logo icon only (gear icon, transparent background)

## Usage

### Favicon

The favicon is automatically copied to each app's `app/icon.svg` directory. Next.js 13+ automatically detects and uses this file.

For additional formats (PNG, ICO), generate them from the SVG:

```bash
# Using ImageMagick (install: brew install imagemagick)
convert -background none -resize 32x32 favicon.svg favicon-32x32.png
convert -background none -resize 16x16 favicon.svg favicon-16x16.png
convert favicon-32x32.png favicon-16x16.png favicon.ico

# Apple touch icon (180x180)
convert -background none -resize 180x180 favicon.svg apple-touch-icon.png
```

### Logo in Components

The logo icon is used in the `IdeAILogo` component via the `IdeAILogoIcon` React component (inline SVG). This ensures it works across all apps without file copying.

### Deployment

All brand assets are stored centrally in `packages/ui/public`. For deployment:

1. SVG favicon is copied to each app's `app/` directory (for Next.js auto-detection)
2. Logo icon is embedded as inline SVG in React components (no file copying needed)
3. PNG/ICO fallbacks can be generated and added to each app's `public/` directory if needed

## SEO and Accessibility

- All icons include proper `aria-label` and `title` attributes
- SVG format ensures scalability and crisp rendering
- Structured data included in logo component for SEO
- Proper semantic HTML (h1, img with alt text)


