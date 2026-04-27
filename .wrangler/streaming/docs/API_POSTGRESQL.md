# PostgreSQL Database Setup
# Download: https://www.postgresql.org/download/

## Option 1: Local PostgreSQL Installation

### Windows Installation:
# 1. Download from https://www.postgresql.org/download/windows/
# 2. Run the installer
# 3. Set password for postgres user
# 4. Keep default port: 5432

### Verify Installation:
# Open pgAdmin or run in terminal:
psql -U postgres

## Option 2: Cloud PostgreSQL (Recommended for Production)

### Neon (Free tier available)
# https://neon.tech/
# - Serverless PostgreSQL
# - Free tier: 512MB storage, 1 project

### Supabase (Free tier available)
# https://supabase.com/
# - PostgreSQL + auto APIs
# - Free tier: 500MB database, 2GB bandwidth

### Railway
# https://railway.app/
# - Simple PostgreSQL setup
# - Pay as you go

### PlanetScale (MySQL, not PostgreSQL)
# https://planetscale.com/
# - Serverless MySQL
# (Not PostgreSQL, but alternative)

## Environment Variables

# For local:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/anime_stream?schema=public"

# For cloud (example with Neon):
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/anime_stream?sslmode=require"

## Prisma Setup

# 1. Install Prisma:
npm install prisma @prisma/client

# 2. Initialize Prisma:
npx prisma init

# 3. Edit prisma/schema.prisma with your models

# 4. Generate Prisma Client:
npm run db:generate

# 5. Push schema to database:
npm run db:push

# 6. Open Prisma Studio (visual database editor):
npm run db:studio

## Database Schema (for anime streaming)

# Users table - handled by NextAuth, but you can extend
# Watch history
# Favorites
# Continue watching
# User preferences

# Example additional tables:
# - UserProfile (bio, avatar, preferences)
# - WatchHistory (userId, animeId, episode, timestamp)
# - Favorites (userId, animeId)
# - AnimeCache (store frequently accessed data)