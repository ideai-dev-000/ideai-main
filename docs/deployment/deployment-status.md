---
title: Deployment Status
description: Current deployment status and tracking for all IdeaI apps
---

# Deployment Status

**Last Updated**: December 31, 2025

## Production Deployments

### ✅ Active Deployments

| App | Project | Production URL | Status | Last Deployed |
|-----|---------|----------------|--------|---------------|
| **web** | `web` (ideai-main) | https://www.myui.space | ✅ Live | 2025-12-31 |
| **docs** | `docs` | https://docs-*.vercel.app | ✅ Live | 2025-12-31 |
| **landing** | `landing` | https://landing-gules-tau.vercel.app | ✅ Live | 2025-12-31 |

### 📊 Deployment Metrics

- **Total Apps Deployed**: 3
- **Deployment Size**: ~576B (optimized from 2GB)
- **Build Status**: ✅ All apps build successfully
- **Cache Status**: Purged and optimized

## Deployment Configuration

### Optimizations Applied

1. **`.vercelignore` Created**: Excludes:
   - `node_modules` (1GB) - installed fresh
   - `.turbo` cache (2.4GB) - not needed
   - Build artifacts
   - Code Context build files

2. **PostCSS Config Fixed**: Converted to ES module syntax for:
   - `tailwind` app
   - `allcss` app
   - `landing` app

3. **TypeScript Errors Fixed**: All apps compile without errors

4. **Memory Leak Fixes**: 
   - Disabled auto-refresh intervals
   - Disabled iframes in cards
   - Optimized React hooks

## Deployment Commands

### Deploy All Apps
```bash
./deploy.sh --prod web docs landing
```

### Deploy Single App
```bash
./deploy.sh --prod web
```

### Purge Cache
```bash
cd apps/{app-name}
vercel cache purge --yes
```

### Check Deployment Status
```bash
cd apps/{app-name}
vercel ls --prod
```

## Vercel Project IDs

- **web**: `prj_rOeGwbNZwaO6sJ2J685Y3g9TV2cw`
- **docs**: `prj_sMbE8TiZyq9hOmt11dmSK2EfRgIk`
- **landing**: `prj_VIRwSW56SWqru373Mby3oB1XYOAz`

## Next Steps

1. ✅ All apps deployed and live
2. ✅ Cache optimized
3. ✅ Deployment size reduced (2GB → 576B)
4. ⏳ Set up monitoring/alerts
5. ⏳ Configure custom domains for docs
6. ⏳ Link remaining apps (all, nocss, mvp, tailwind, allcss)

## Monitoring

### Health Checks

- **web**: https://www.myui.space
- **landing**: https://landing-gules-tau.vercel.app
- **docs**: Check Vercel dashboard for latest URL

### Deployment Tracking

All deployments are tracked in Vercel dashboard:
- https://vercel.com/idea-i/web
- https://vercel.com/idea-i/docs
- https://vercel.com/idea-i/landing

## Notes

- Deployment size dramatically reduced by excluding unnecessary files
- All apps use optimized build configuration
- Memory leak issues resolved in landing app
- All apps tested locally before deployment


