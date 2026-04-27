# NextAuth.js Setup (Authentication)
# Documentation: https://next-auth.js.org/
# Sign up at: https://next-auth.js.org/configuration/providers

## Supported Providers

### OAuth Providers (need API keys):
- Google: https://console.cloud.google.com/
- Discord: https://discord.com/developers/applications
- GitHub: https://github.com/settings/developers
- Twitter/X: https://developer.twitter.com/

### Email (Passwordless):
- SendGrid: https://sendgrid.com/
- Resend: https://resend.com/
- Nodemailer (custom SMTP)

## Environment Variables

# For NextAuth (add to .env.local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Generate secret:
# openssl rand -base64 32

# Provider-specific (example with Google):
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Discord:
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# GitHub:
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

## Setup Steps

### 1. Install NextAuth:
npm install next-auth

### 2. Create auth configuration:
# src/app/api/auth/[...nextauth]/route.ts

### 3. Configure providers:
# Google, Discord, GitHub, etc.

### 4. Add session provider to app:
# src/app/providers.tsx

### 5. Use session in components:
const { data: session } = useSession()

## Provider Setup Links

### Google OAuth:
1. Go to https://console.cloud.google.com/
2. Create project
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - https://yourdomain.com/api/auth/callback/google

### Discord OAuth:
1. Go to https://discord.com/developers/applications
2. New Application
3. OAuth2 → Add Redirect
4. Set redirect to:
   - http://localhost:3000/api/auth/callback/discord

### GitHub OAuth:
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Set callback URL:
   - http://localhost:3000/api/auth/callback/github