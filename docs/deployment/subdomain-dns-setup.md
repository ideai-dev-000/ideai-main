---
title: Subdomain DNS Setup Guide
description: Complete guide for configuring subdomain DNS and Vercel domain settings for IdeaI apps
---

# Subdomain DNS Setup Guide

Complete guide for setting up subdomains (e.g., `docs.myui.space`) for IdeaI apps.

## Overview

This guide covers:
1. **DNS Configuration** - Setting up DNS records at your domain registrar
2. **Vercel Domain Configuration** - Adding domains in Vercel dashboard
3. **Automation Script** - Helper script to automate the process

## Prerequisites

- Domain registered (e.g., `myui.space`)
- Access to domain registrar DNS settings
- Vercel account with project access
- Vercel CLI installed and authenticated

## Step 1: DNS Configuration

### Option A: Using Vercel's DNS (Recommended)

If your domain is managed by Vercel or you want to use Vercel's nameservers:

1. **Add domain to Vercel**:
   ```bash
   vercel domains add myui.space
   ```

2. **Configure nameservers** at your registrar:
   - Go to your domain registrar's DNS settings
   - Update nameservers to Vercel's nameservers (provided by Vercel)
   - Wait for DNS propagation (can take up to 48 hours)

### Option B: Using Your Registrar's DNS

If you want to keep DNS management at your registrar:

1. **Get Vercel DNS records**:
   ```bash
   # For root domain
   vercel domains inspect myui.space
   
   # This will show you the DNS records needed
   ```

2. **Add DNS records at registrar**:
   - **A Record** (for root domain):
     - Name: `@` or blank
     - Value: `76.76.21.21` (Vercel's IP - verify current IP)
     - TTL: 3600
   
   - **CNAME Record** (for subdomains):
     - Name: `docs` (or your subdomain)
     - Value: `cname.vercel-dns.com` (verify with Vercel)
     - TTL: 3600

## Step 2: Add Subdomain in Vercel

### Via Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter subdomain: `docs.myui.space`
5. Click **Add**
6. Vercel will provide DNS records if needed

### Via Vercel CLI

```bash
# Add subdomain to docs project
cd apps/docs
vercel domains add docs.myui.space

# Verify domain is added
vercel domains ls
```

## Step 3: Verify DNS Configuration

### Check DNS Propagation

```bash
# Check if DNS records are propagated
dig docs.myui.space
nslookup docs.myui.space

# Check specific record type
dig CNAME docs.myui.space
```

### Test Domain Resolution

```bash
# Test if domain resolves
curl -I https://docs.myui.space

# Should return 200 OK or redirect
```

## Step 4: Update Environment Variables

After DNS is configured and domain is added to Vercel:

1. **Update web app environment variable**:
   ```bash
   cd apps/web
   vercel env add NEXT_PUBLIC_DOCS_URL production
   # Enter: https://docs.myui.space
   ```

2. **Redeploy web app**:
   ```bash
   cd apps/web
   vercel deploy --prod
   ```

## Automation Script

Here's a helper script to automate subdomain setup:

```bash
#!/bin/bash
# scripts/setup-subdomain.sh
# Usage: ./scripts/setup-subdomain.sh <app-name> <subdomain> <root-domain>

set -e

APP_NAME=$1
SUBDOMAIN=$2
ROOT_DOMAIN=$3

if [ -z "$APP_NAME" ] || [ -z "$SUBDOMAIN" ] || [ -z "$ROOT_DOMAIN" ]; then
  echo "Usage: $0 <app-name> <subdomain> <root-domain>"
  echo "Example: $0 docs docs myui.space"
  exit 1
fi

FULL_DOMAIN="${SUBDOMAIN}.${ROOT_DOMAIN}"
ENV_VAR_NAME="NEXT_PUBLIC_${APP_NAME^^}_URL"
ENV_VAR_VALUE="https://${FULL_DOMAIN}"

echo "🚀 Setting up subdomain: ${FULL_DOMAIN}"
echo ""

# Step 1: Add domain to Vercel project
echo "📋 Step 1: Adding domain to Vercel project..."
cd "apps/${APP_NAME}"
vercel domains add "${FULL_DOMAIN}" || {
  echo "⚠️  Domain might already be added, continuing..."
}
cd ../..

# Step 2: Show DNS instructions
echo ""
echo "📋 Step 2: DNS Configuration Required"
echo "======================================"
echo "Add the following DNS record at your registrar:"
echo ""
echo "Type: CNAME"
echo "Name: ${SUBDOMAIN}"
echo "Value: cname.vercel-dns.com"
echo "TTL: 3600"
echo ""
echo "Or use Vercel's nameservers if managing DNS through Vercel."
echo ""
read -p "Press Enter after DNS is configured..."

# Step 3: Verify DNS
echo ""
echo "📋 Step 3: Verifying DNS configuration..."
if dig "${FULL_DOMAIN}" +short | grep -q "."; then
  echo "✅ DNS is resolving"
else
  echo "⚠️  DNS not yet propagated. This can take up to 48 hours."
  echo "   Continuing anyway..."
fi

# Step 4: Update environment variable in web app
echo ""
echo "📋 Step 4: Updating environment variable in web app..."
cd apps/web
vercel env add "${ENV_VAR_NAME}" production <<< "${ENV_VAR_VALUE}" || {
  echo "⚠️  Environment variable might already exist"
  echo "   Updating existing variable..."
  vercel env rm "${ENV_VAR_NAME}" production --yes
  vercel env add "${ENV_VAR_NAME}" production <<< "${ENV_VAR_VALUE}"
}
cd ../..

# Step 5: Redeploy web app
echo ""
echo "📋 Step 5: Redeploying web app..."
cd apps/web
vercel deploy --prod
cd ../..

echo ""
echo "✅ Subdomain setup complete!"
echo ""
echo "Summary:"
echo "  - Domain: ${FULL_DOMAIN}"
echo "  - App: ${APP_NAME}"
echo "  - Environment Variable: ${ENV_VAR_NAME}=${ENV_VAR_VALUE}"
echo ""
echo "Next steps:"
echo "  1. Wait for DNS propagation (if not already done)"
echo "  2. Test: https://${FULL_DOMAIN}"
echo "  3. Test redirect: https://www.${ROOT_DOMAIN}/apps/${APP_NAME}"
```

### Usage

```bash
# Make script executable
chmod +x scripts/setup-subdomain.sh

# Setup docs subdomain
./scripts/setup-subdomain.sh docs docs myui.space
```

## DNS Record Types Explained

### CNAME Record (Recommended for Subdomains)

**Use for**: Subdomains (e.g., `docs.myui.space`)

```
Type: CNAME
Name: docs
Value: cname.vercel-dns.com
TTL: 3600
```

**Pros**:
- Easy to manage
- Automatically updates if Vercel IPs change
- Recommended by Vercel

**Cons**:
- Cannot use CNAME for root domain (must use A record)

### A Record (For Root Domain Only)

**Use for**: Root domain (e.g., `myui.space`)

```
Type: A
Name: @ (or blank)
Value: 76.76.21.21 (verify current Vercel IP)
TTL: 3600
```

**Note**: Vercel IPs can change. Check current IPs in Vercel dashboard.

## Troubleshooting

### DNS Not Propagating

1. **Check DNS propagation**:
   ```bash
   dig docs.myui.space
   nslookup docs.myui.space
   ```

2. **Wait**: DNS propagation can take 24-48 hours

3. **Clear DNS cache**:
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Domain Not Resolving

1. **Verify DNS records**:
   ```bash
   dig CNAME docs.myui.space
   ```

2. **Check Vercel domain status**:
   ```bash
   vercel domains ls
   vercel domains inspect docs.myui.space
   ```

3. **Verify SSL certificate**:
   - Vercel automatically provisions SSL certificates
   - Check in Vercel dashboard → Domains → SSL

### SSL Certificate Issues

1. **Wait for SSL provisioning**: Vercel automatically provisions SSL (can take a few minutes)

2. **Check SSL status**:
   ```bash
   vercel domains inspect docs.myui.space
   ```

3. **Force SSL renewal** (if needed):
   - Go to Vercel dashboard → Domains
   - Click on domain → SSL settings
   - Request certificate renewal

## Quick Reference

### Common Commands

```bash
# List all domains
vercel domains ls

# Add domain to project
vercel domains add docs.myui.space

# Inspect domain configuration
vercel domains inspect docs.myui.space

# Remove domain
vercel domains rm docs.myui.space

# Check DNS propagation
dig docs.myui.space
nslookup docs.myui.space
```

### Environment Variables

```bash
# Set standalone URL for web app
cd apps/web
vercel env add NEXT_PUBLIC_DOCS_URL production
# Enter: https://docs.myui.space

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm NEXT_PUBLIC_DOCS_URL production
```

## Next Steps

After subdomain is configured:

1. ✅ DNS records added
2. ✅ Domain added to Vercel project
3. ✅ SSL certificate provisioned (automatic)
4. ✅ Environment variable set in web app
5. ✅ Web app redeployed
6. ✅ Test redirect: `https://www.myui.space/apps/docs` → should redirect to `https://docs.myui.space`

## Related Documentation

- [Vercel Domain Configuration](vercel.md#domain-configuration)
- [Deployment Strategies](deployment-strategies.md)
- [Environment Variables Reference](deployment-strategies.md#environment-variables-reference)


