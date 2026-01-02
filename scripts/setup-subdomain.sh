#!/bin/bash
# @fileoverview Subdomain DNS setup automation script
# @description Automates the process of setting up subdomains for IdeaI apps
# @usage ./scripts/setup-subdomain.sh <app-name> <subdomain> <root-domain>
# @example ./scripts/setup-subdomain.sh docs docs myui.space

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


