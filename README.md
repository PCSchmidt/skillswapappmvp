# SkillSwap

A skill-sharing and bartering platform where users trade expertise within hyper-local communities. Built as a full-stack portfolio project showcasing Next.js 14, Supabase, and an AI-powered skill matching backend.

**Live:** [skillswapappmvp.vercel.app](https://skillswapappmvp.vercel.app)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel (Frontend)                  │
│  Next.js 14 · React 18 · TypeScript · Tailwind CSS     │
│  skillswapappmvp.vercel.app                             │
└──────────────┬──────────────────────┬───────────────────┘
               │  Auth / Data (REST)  │  AI Matching (REST)
               ▼                      ▼
┌──────────────────────────┐ ┌────────────────────────────┐
│     Supabase (Database)  │ │   Railway (AI Backend)     │
│  PostgreSQL · pgvector   │ │   FastAPI · Python 3.12    │
│  RLS · Auth · Triggers   │ │   sentence-transformers    │
│  384-dim embeddings      │ │   all-MiniLM-L6-v2 (384d) │
└──────────────────────────┘ └────────────────────────────┘
```

## License

Copyright Paul C. Schmidt 2025. All rights reserved. Unauthorized use, reproduction, or distribution of this software is prohibited.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript 5.2, Tailwind CSS 3.3 |
| Database | Supabase (PostgreSQL, pgvector, RLS, triggers) |
| Auth | Supabase Auth with email verification |
| AI Backend | Python 3.12 / FastAPI / sentence-transformers on Railway |
| Hosting | Vercel (frontend) + Railway (AI backend) |

## Features

- **Skill Listings** — Create, browse, and search skills across 10 categories with proficiency levels
- **AI Skill Matching** — Semantic similarity via 384-dim embeddings (all-MiniLM-L6-v2) with pgvector storage
- **Trade Proposals** — Request skill swaps with message threads and accept/decline workflow
- **Real-time Messaging** — Direct chat between trade partners
- **Ratings & Reviews** — Post-trade rating system with star ratings and comments
- **User Profiles** — Editable profiles with skill portfolios and trade history
- **Email Notifications** — Configurable notification preferences

## Design System

Editorial dark-mode aesthetic:
- **Fonts**: Manrope (body) + Cormorant Garamond (display)
- **Accent**: Emerald `#047857`
- **Canvas**: Near-black `#06070b` with `rgba(255,255,255,0.08)` borders
- **Radius**: Zero globally — sharp rectangular cards and inputs
- **Effects**: Emerald ambient glow, backdrop-blur navigation

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and service role key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_AI_BACKEND_URL` | AI backend URL (Railway) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # User dashboard
│   ├── skills/             # Skill CRUD + browse + detail
│   ├── trades/             # Trade proposals
│   ├── messages/           # Messaging
│   ├── profiles/           # User profiles
│   ├── notifications/      # Notification center
│   ├── settings/           # User settings
│   ├── login/              # Auth pages
│   └── signup/
├── components/             # Reusable UI components
│   ├── navigation/         # Navbar
│   ├── skills/             # Skill cards, forms, lists
│   ├── trades/             # Trade proposal components
│   ├── messages/           # Chat UI
│   ├── ratings/            # Star ratings, review forms
│   └── auth/               # Login/signup forms
├── lib/
│   ├── supabase/           # Supabase client configuration
│   └── api/                # AI backend client (aiClient.ts)
├── hooks/                  # Custom React hooks
├── providers/              # Context providers (auth, responsive)
└── types/                  # TypeScript type definitions
backend/
├── main.py                 # FastAPI app (embed, match, health)
└── requirements.txt        # Python dependencies
supabase/
└── migrations/             # Database schema migrations (6 files)
scripts/
└── seed_demo_data.py       # Demo data seeder (3 users, 15 skills)
```

## Testing

```bash
npm test              # Run Jest unit tests
npm run test:coverage # With coverage report
npm run cypress       # Open Cypress E2E runner
```

## Inference Performance

SkillSwap's AI matching uses `all-MiniLM-L6-v2` (384-dim) sentence embeddings with pgvector cosine similarity. A companion study benchmarked five deployment configurations for this exact model:

| Configuration | p50 Latency | Throughput | Model Size |
|---|---|---|---|
| PyTorch (baseline) | 12.1 ms | 68 req/s | 88 MB |
| ONNX Runtime | 8.5 ms | 151 req/s | 88 MB |
| ONNX + INT8 quantized | 3.2 ms | 234 req/s | 23 MB |
| ONNX + INT8 batch=32 | 2.9 ms | 602 req/s | 23 MB |

See the full [Inference Optimization Study](https://github.com/PCSchmidt/inference-optimization-study) for methodology, accuracy validation, and reproducible benchmarks.

## Current Status

See [PROGRESS.md](PROGRESS.md) for detailed status and [ROADMAP.md](ROADMAP.md) for the development plan.
