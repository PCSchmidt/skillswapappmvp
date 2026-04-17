# SkillSwap — Roadmap

Public-facing development plan.

---

## v0.1 — Foundation ✅

Establish the editorial design system and clean up technical debt.

- Editorial design tokens (Tailwind config, globals.css)
- Server component layout with Google Fonts
- Dashboard and login pages redesigned
- Navigation with mobile hamburger drawer
- ESLint and build pipeline fixed
- Stale documentation archived, README rewritten

---

## v0.2 — Visual Consistency (Current)

Apply the editorial design system across all pages and components. No feature changes — purely visual migration.

- Landing page and signup flow
- Auth components (LoginForm, SignupForm)
- Skill components (SkillCard, SkillForm, SkillList)
- Trade, messaging, rating, and profile UIs
- Settings and notification pages

---

## v0.3 — AI Skill Matching

Add an intelligent backend for skill recommendations.

- Python/FastAPI service deployed on Railway
- pgvector extension for skill embeddings
- `/api/match` endpoint returning ranked skill matches
- Frontend integration with match suggestions

---

## v0.4 — Production Deploy

Ship the complete application with demo data.

- Seed data for portfolio demonstration
- Vercel frontend deployment
- Railway backend deployment
- Demo guide with walkthrough narrative
- Portfolio site integration

---

## v0.5 — Polish

Final quality pass before portfolio presentation.

- Loading skeletons and error boundaries
- Accessibility improvements
- Performance optimization
- Resolve `typescript.ignoreBuildErrors` workaround
