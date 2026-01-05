# Vercel Token Permissions Guide

## Required Permissions

The Cloud Manager needs a Vercel API token with the following permissions:

### API Endpoints Used:

1. **GET `/v9/projects`** - List all projects
2. **GET `/v9/projects/{id}`** - Get project settings
3. **PATCH `/v9/projects/{id}`** - Update project settings

### Required Access:

- ✅ **Read access** to projects (to list and view settings)
- ✅ **Write access** to projects (to update settings like Root Directory, Build Command, etc.)
- ✅ **Team/Organization access** - Must have access to the team: `team_vhjzlMi6CfNow0IfBXnv2Yn2`

## Token Types

Vercel tokens can be:

1. **Personal Account Token** - Access to your personal projects
2. **Team Token** - Access to team projects (recommended for this use case)

## How to Check Your Existing Token

### Test if your token works:

```bash
# Test listing projects
curl "https://api.vercel.com/v9/projects?teamId=team_vhjzlMi6CfNow0IfBXnv2Yn2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# If successful, you'll see JSON with projects
# If you get 401/403, the token is invalid or lacks permissions
```

### Common Issues:

1. **401 Unauthorized** - Token is invalid or expired
2. **403 Forbidden** - Token doesn't have access to the team/projects
3. **404 Not Found** - Team ID is incorrect

## Creating a New Token (if needed)

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. **Name**: "Cloud Manager" (or any descriptive name)
4. **Scope**:
   - Select your **Team** (not Personal Account)
   - Or select "Full Account" if you want access to everything
5. **Expiration**: Set as needed (or never expire for development)
6. **Copy the token** - You won't see it again!

## Setting Up the Token

Once you have a valid token:

```bash
# Create .env.local in apps/web/
echo "VERCEL_TOKEN=your_token_here" > apps/web/.env.local

# Restart the dev server
pnpm --filter web dev
```

## Verifying Token Permissions

The Cloud Manager UI will show:

- ✅ **Success**: Projects load in the dropdown
- ❌ **Error**: Clear error message if token is missing/invalid

If you see "Vercel token not configured" or "Failed to load projects", check:

1. Token is set in `apps/web/.env.local`
2. Token has access to the team
3. Token hasn't expired
4. Dev server was restarted after setting the token
