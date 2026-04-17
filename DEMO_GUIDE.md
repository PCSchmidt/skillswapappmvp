# SkillSwap Demo Guide

**Live App:** [skillswapappmvp.vercel.app](https://skillswapappmvp.vercel.app)

## Quick Tour

### 1. Browse Skills
Navigate to **Skills → Browse** to see all listed skills across 10 categories (Technology, Arts & Crafts, Culinary, Education, Fitness & Wellness, Home Improvement, Languages, Music, Professional Services, Other).

### 2. View Skill Detail + AI Matches
Click any skill card to see its detail page. The **"Similar Skills"** section shows AI-powered recommendations ranked by semantic similarity (384-dim embeddings via sentence-transformers).

### 3. Sign Up & Create a Skill
1. Click **Sign Up** and create an account with email verification.
2. Go to **Skills → Create** and list a skill you offer or seek.
3. The AI backend automatically generates an embedding for your skill on creation.

### 4. Propose a Trade
From any skill detail page, click **Propose Trade** to start a skill swap with the listing owner.

### 5. Messaging
Trade partners can chat via the **Messages** tab attached to each trade.

### 6. Rate & Review
After completing a trade, both parties can leave star ratings and written reviews.

## Architecture

```
Vercel (Next.js 14)  ←→  Supabase (PostgreSQL + pgvector)
                     ←→  Railway (FastAPI + sentence-transformers)
```

## Demo Accounts

The app is seeded with 3 demo users and 15 skills for browsing. Sign up with your own email to test the full flow.
