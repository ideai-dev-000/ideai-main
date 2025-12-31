# Quick Fix: Deployment Path Errors

## Error: "The provided path does not exist"

If you see errors like:
```
Error: The provided path "~/_IDEAI/ideai-main/apps/web/apps/web" does not exist
```

This means the **Root Directory** in Vercel dashboard is set incorrectly.

## Fix Steps

### For Each Project (web, docs, landing, etc.)

1. **Go to Vercel Dashboard**:
   - https://vercel.com/idea-i/{project-name}/settings/general
   - Example: https://vercel.com/idea-i/web/settings

2. **Check Root Directory**:
   - Should be: `apps/{project-name}`
   - Example: `apps/web`, `apps/docs`, `apps/landing`
   - ⚠️ **NOT**: `apps/web/apps/web` or full path

3. **Enable**:
   - ✅ "Include files outside the root directory in the Build Step"

4. **Save Settings**

## Verification

After fixing, test deployment:

```bash
# Test single app
./deploy.sh --prod web

# Or deploy all
./deploy.sh --prod
```

## Common Mistakes

❌ **Wrong**: Root Directory = `apps/web/apps/web`  
✅ **Correct**: Root Directory = `apps/web`

❌ **Wrong**: Root Directory = `~/_IDEAI/ideai-main/apps/web`  
✅ **Correct**: Root Directory = `apps/web`

❌ **Wrong**: Root Directory = `/apps/web`  
✅ **Correct**: Root Directory = `apps/web`

The Root Directory should be **relative to the repo root**, not an absolute path.

