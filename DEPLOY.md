# Deployment Guide

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Set Environment Variables**:
   After deployment, go to your Vercel dashboard:
   - Navigate to your project → Settings → Environment Variables
   - Add these variables:
     - `AUTH_SECRET` - Your auth secret (use the one from .env.local)
     - `POSTGRES_URL` - Your Neon database connection string
     - `V0_API_KEY` - Your v0 API key

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub** (create a new repo if needed):
   ```bash
   # Create a new GitHub repository, then:
   git remote set-url origin <your-new-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `AUTH_SECRET`
     - `POSTGRES_URL`
     - `V0_API_KEY`

4. **Deploy**: Vercel will automatically deploy

### Option 3: One-Click Deploy (if you have a public repo)

Use the Vercel deploy button from the README, which will:
- Set up the project
- Configure Neon database (if selected)
- Prompt for environment variables

## Environment Variables for Production

Make sure to set these in your Vercel project:

```
AUTH_SECRET=your-generated-auth-secret-here
POSTGRES_URL=postgresql://user:password@host:port/database
V0_API_KEY=your_v0_api_key_here
```

**Important**: 
- Generate a new `AUTH_SECRET` for production using `openssl rand -base64 32`
- Use your production database URL from your database provider
- Get your V0 API key from https://v0.dev/chat/settings/keys
- **NEVER commit secrets to git** - only use `.env.local` for local development
- Keep your API keys secure and rotate them regularly

## Post-Deployment

1. **Run Database Migrations**: 
   The build script automatically runs migrations, but you can verify:
   ```bash
   vercel env pull .env.production
   pnpm db:migrate
   ```

2. **Test the Deployment**:
   - Visit your Vercel URL
   - Test creating a chat
   - Verify authentication works

## Troubleshooting

- **Build fails**: Check that all environment variables are set
- **Database errors**: Verify POSTGRES_URL is correct and database is accessible
- **API errors**: Check V0_API_KEY is valid and has proper permissions

