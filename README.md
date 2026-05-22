# InboxPilot

AI-powered unified communication platform for small businesses. Centralizes Instagram DMs, WhatsApp, and Telegram into one dashboard with AI-powered business insights.

## Tech Stack

- **Backend:** Node.js 22, Express.js, TypeScript
- **Database:** PostgreSQL 16 with Prisma ORM
- **AI:** OpenAI API (gpt-4o-mini)
- **Auth:** JWT (JSON Web Tokens) with bcrypt
- **Infrastructure:** Docker, Docker Compose
- **Frontend:** Vanilla JS SPA (in `src/`)

## Quick Start

### Prerequisites

- Node.js 22+
- Docker (for PostgreSQL)
- npm

### Setup

```bash
# 1. Start PostgreSQL
cd backend
docker compose -f docker/docker-compose.yml up -d db

# 2. Install dependencies
npm install

# 3. Generate Prisma client and run migration
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed demo data
npx tsx prisma/seed.ts

# 5. Start development server
npm run dev
```

Open **http://localhost:5000** in your browser.

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://inboxpilot:inboxpilot@localhost:5432/inboxpilot` |
| `JWT_SECRET` | Secret key for JWT signing | `dev-jwt-secret-inboxpilot-2026` |
| `OPENAI_API_KEY` | OpenAI API key (optional - demo mode without it) | `sk-your-openai-api-key` |
| `OPENAI_MODEL` | OpenAI model name | `gpt-4o-mini` |

> **Note:** Without an OpenAI API key, the app runs in demo mode with rule-based fallbacks for AI features.

## Architecture

```
backend/
├── prisma/             # Database schema + seed
├── docker/             # Dockerfile + docker-compose
├── src/
│   ├── app.ts          # Express entry point
│   ├── config/         # Env vars, Prisma client
│   ├── middleware/      # Auth guard, validation, error handler, CORS
│   ├── modules/        # Domain modules
│   │   ├── auth/       # Registration, login, JWT
│   │   ├── conversations/ # Inbox, replies, priority
│   │   ├── messages/   # Message history
│   │   ├── ai/         # OpenAI integration + prompts
│   │   ├── analytics/  # Metrics, sales data, bootstrap
│   │   ├── integrations/ # Platform webhooks + message normalizer
│   │   ├── products/   # Product CRUD
│   │   └── users/      # Team management
│   └── jobs/           # Cron jobs (unanswered detector, summary generator)
└── tests/
```

## API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create business account | No |
| `POST` | `/api/auth/login` | Login, returns JWT | No |
| `GET` | `/api/bootstrap` | Load all dashboard data | Demo |
| `GET` | `/api/conversations` | List conversations | Demo |
| `GET` | `/api/conversations/:id` | Single conversation | Demo |
| `POST` | `/api/conversations/:id/reply` | Send reply | Demo |
| `POST` | `/api/conversations/:id/priority` | Mark priority | Demo |
| `POST` | `/api/conversations/assign-urgent` | Clear urgent flags | Demo |
| `GET` | `/api/messages/:convId` | Message history | Demo |
| `GET` | `/api/metrics` | Dashboard metrics | Demo |
| `POST` | `/api/metrics/demo-update` | Demo metrics mutation | Demo |
| `GET` | `/api/summary` | AI daily summary | Demo |
| `GET` | `/api/notifications` | Urgent + stock alerts | Demo |
| `POST` | `/api/ai/extract` | AI sales extraction | Demo |
| `GET` | `/api/analytics/sales` | Sales analytics | Demo |
| `GET` | `/api/analytics/products` | Product demand | Demo |
| `GET` | `/api/analytics/unanswered` | Unanswered conversations | Demo |
| `GET` | `/api/channels` | Connected platform counts | Demo |
| `GET` | `/api/products` | List products | Demo |
| `POST` | `/api/products` | Add product | Demo |
| `POST` | `/api/sales` | Create sale record | Demo |
| `POST` | `/api/team/invite` | Invite team member | Demo |
| `POST` | `/api/team/:name/permissions` | Get permissions | Demo |
| `POST` | `/api/billing/select` | Select subscription plan | Demo |

> "Demo" auth means the endpoints work without a JWT by using a seeded demo business context.

## Database

PostgreSQL schema with 8 models:

- **User** — business employees with roles
- **Business** — tenant/company
- **Conversation** — unified inbox thread
- **Message** — individual chat messages
- **AIExtraction** — AI-extracted sales data
- **Product** — tracked products
- **PlatformIntegration** — connected social accounts
- **AnalyticsSummary** — daily/weekly/monthly reports

## AI Features

- **Sales Extraction** — analyzes customer messages to extract product, quantity, revenue
- **Daily/Weekly Summaries** — generates business insights and recommendations
- **Product Demand Detection** — identifies frequently requested products
- **Unanswered Detection** — auto-flags conversations without business replies (30 min threshold)

## Cron Jobs

- **Unanswered Detector** (every 2 min) — marks stale conversations as `NEEDS_ATTENTION`
- **Summary Generator** (daily at 23:00) — generates analytics summaries

## Frontend

The SPA lives in `src/` and is served by Express as a static site. It was originally built as a Flask prototype and is fully compatible with the new Node.js backend.

## Docker

```bash
# Full stack (app + db)
docker compose -f docker/docker-compose.yml up --build

# Database only (for local development)
docker compose -f docker/docker-compose.yml up -d db
```

## Testing

```bash
npm test
```

Contract tests verify API responses match frontend expectations.
