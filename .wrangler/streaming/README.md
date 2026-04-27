# AnimeStream 🎬

A modern anime streaming website built with Next.js, Cloudflare, and the Jikan API.

## Features

- 🔍 Search anime from Jikan API (MyAnimeList)
- 📺 HLS video streaming with Video.js
- ☁️ Cloudflare CDN for fast delivery
- 👤 User authentication (Google, Discord, GitHub)
- ❤️ Favorites and watch history
- 📱 Responsive design

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js |
| Database | PostgreSQL + Prisma |
| Video Player | Video.js + HLS.js |
| Anime Data | Jikan API (free) |
| Hosting | Cloudflare (Stream, R2, CDN) |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000)
- Provider credentials (Google, Discord, GitHub)

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Setup Guides

See the `docs/` folder for detailed setup instructions:

- [API_JIKAN.md](docs/API_JIKAN.md) - Free anime data (no key needed)
- [API_ANILIST.md](docs/API_ANILIST.md) - GraphQL anime API
- [API_CLOUDFLARE.md](docs/API_CLOUDFLARE.md) - Video hosting & CDN
- [API_FIREBASE.md](docs/API_FIREBASE.md) - Authentication
- [API_POSTGRESQL.md](docs/API_POSTGRESQL.md) - Database
- [API_NEXTAUTH.md](docs/API_NEXTAUTH.md) - Auth providers
- [API_VIDEOJS.md](docs/API_VIDEOJS.md) - Video player

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth endpoints
│   ├── anime/[id]/        # Anime detail page
│   ├── search/            # Search page
│   ├── watch/[id]/        # Video player page
│   ├── favorites/         # User favorites
│   ├── profile/           # User profile
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── VideoPlayer.tsx    # Video.js player
│   ├── AnimeCard.tsx      # Anime display card
│   └── ...
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth config
│   ├── jikan.ts           # Jikan API client
│   ├── anilist.ts         # AniList API client
│   ├── cloudflare-stream.ts # Cloudflare Stream
│   └── prisma.ts          # Prisma client
└── stores/                # Zustand state stores
prisma/
└── schema.prisma          # Database schema
docs/                      # API setup guides
```

## License

MIT - Created for educational purposes. Not affiliated with any streaming service.