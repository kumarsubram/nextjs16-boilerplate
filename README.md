# Next.js 16 Boilerplate

A production-ready starter for SaaS apps. Next.js 16, React 19, TypeScript, Tailwind CSS v4, Better Auth, Stripe, and Drizzle ORM — all wired together with clean code and sensible defaults.

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-username/nextjs16-boilerplate.git my-app
cd my-app
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local — see "Environment Variables" below

# Set up database and run
npm run db:push
npm run db:seed    # optional: populate sample data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Always use port 3000 for local development — OAuth redirect URIs are configured for it.

## Environment Variables

Edit `.env.local` with your values:

```bash
# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Auth (required) — generate secret: openssl rand -base64 32
BETTER_AUTH_SECRET=your-32-character-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (required) — see docs/GOOGLE_AUTH.md
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional) — see docs/STRIPE.md
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

## What's Included

**Core**

- Next.js 16 with Turbopack and React Compiler
- TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui components
- ESLint 9 + Prettier + Husky pre-commit hooks
- Vitest + React Testing Library

**Auth & Users**

- Better Auth with Google OAuth
- Role-based permissions (`admin`, `user`)
- Subscription tiers (`free`, `pro`, `enterprise`)
- User profiles with donation tracking

**Payments (Optional)**

- Stripe subscriptions, one-time payments, donations
- Webhook handler with automatic plan sync
- Customer portal integration

**Database**

- Drizzle ORM with PostgreSQL
- Primary + optional secondary database
- SSL, connection pooling, PgBouncer support
- Seed script with sample data

**Production Ready**

- Security headers (HSTS, CSP, X-Frame-Options)
- SEO metadata (OpenGraph, Twitter cards)
- Error boundaries and loading states
- Mobile-first responsive design
- Animated mobile navigation

## Project Structure

```
src/
├── actions/           # Server actions (auth, payments, roles)
├── app/               # Pages and API routes
│   ├── (auth)/login/  # Login page
│   ├── api/auth/      # Better Auth handler
│   └── api/stripe/    # Stripe webhook
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── auth/          # Auth button
│   ├── layouts/       # Navbar, Footer
│   └── navigation/    # Mobile menu
├── db/
│   ├── schema/        # Drizzle table schemas
│   ├── primary.ts     # Main database connection
│   └── seed.ts        # Sample data seeder
├── hooks/             # Custom React hooks
├── lib/
│   ├── auth.ts        # Better Auth config
│   ├── stripe/        # Stripe client + helpers
│   ├── api/           # Typed fetch client
│   └── validations/   # Zod schemas
├── constants/         # App name, logo, URLs
├── services/          # Client-side API calls
└── types/             # TypeScript definitions
```

## Available Scripts

| Script                | Description                    |
| --------------------- | ------------------------------ |
| `npm run dev`         | Start dev server (Turbopack)   |
| `npm run build`       | Production build               |
| `npm run start`       | Start production server        |
| `npm run lint:fix`    | Lint and auto-fix              |
| `npm run type-check`  | TypeScript compiler check      |
| `npm run test`        | Run tests                      |
| `npm run test:watch`  | Tests in watch mode            |
| `npm run db:push`     | Apply schema to database (dev) |
| `npm run db:generate` | Generate SQL migration files   |
| `npm run db:migrate`  | Run pending migrations (prod)  |
| `npm run db:seed`     | Seed sample data               |
| `npm run db:studio`   | Browse data in Drizzle Studio  |

## Starting a New Project

```bash
# 1. Clone and reset git history
git clone https://github.com/your-username/nextjs16-boilerplate.git my-project
cd my-project
rm -rf .git
git init

# 2. Update package.json name
# 3. Set up .env.local
# 4. Replace logo in public/images/logo.svg
# 5. Update app name in src/constants/index.ts
# 6. Set up database: npm run db:push && npm run db:seed
# 7. Set up Google OAuth (docs/GOOGLE_AUTH.md)
# 8. Start building: npm run dev
```

## Documentation

| Document                                                 | Purpose                         |
| -------------------------------------------------------- | ------------------------------- |
| [`docs/GOOGLE_AUTH.md`](docs/GOOGLE_AUTH.md)             | Google OAuth setup guide        |
| [`docs/STRIPE.md`](docs/STRIPE.md)                       | Stripe payments setup guide     |
| [`docs/DB_SETUP.md`](docs/DB_SETUP.md)                   | Database setup and seeding      |
| [`docs/CLAUDE.md`](docs/CLAUDE.md)                       | AI coding conventions           |
| [`docs/NEXT_STEPS.md`](docs/NEXT_STEPS.md)               | Template roadmap and how-tos    |
| [`docs/NEXT_STEPS_DEVOPS.md`](docs/NEXT_STEPS_DEVOPS.md) | Production deployment checklist |

## Requirements

- Node.js >= 20 (see `.nvmrc`)
- PostgreSQL database

## License

MIT
