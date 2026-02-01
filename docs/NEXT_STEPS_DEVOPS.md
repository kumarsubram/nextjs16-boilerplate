# DevOps & Production

Checklist and considerations for deploying this app to production.

## Deployment Checklist

### Environment Variables

- [ ] Set all required variables (see `.env.example`)
- [ ] `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` → production domain
- [ ] `BETTER_AUTH_SECRET` → new production secret (`openssl rand -base64 32`)
- [ ] `DATABASE_SSL=require` for remote PostgreSQL

### Database

- [ ] Set up PostgreSQL (AWS RDS, VPS, Neon, Supabase, etc.)
- [ ] Run migrations: `npm run db:generate && npm run db:migrate` (not `db:push`)
- [ ] If using a connection pooler (PgBouncer, RDS Proxy): set `DATABASE_PREPARE=false`
- [ ] Configure `DATABASE_MAX_CONNECTIONS` based on instance size
- [ ] Set up database backups

### Auth

- [ ] Configure Google OAuth redirect URI for production domain
- [ ] Publish Google OAuth app (move from "Testing" to "In production")
- [ ] If app requests only `email`, `profile`, `openid` scopes — no Google verification needed

### Stripe

- [ ] Set production Stripe keys (`sk_live_...`, `pk_live_...`)
- [ ] Create webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Enable required webhook events (see `docs/STRIPE.md`)
- [ ] Set `metadata.plan` on Stripe products to match plan tiers (`pro`, `enterprise`)

### Security

- [ ] Set up SSL/TLS certificate (Let's Encrypt, AWS ACM, Cloudflare)
- [ ] Enable HSTS preload at [hstspreload.org](https://hstspreload.org/)
- [ ] Tighten CSP in `next.config.ts` (add specific domains, remove `'unsafe-eval'`)
- [ ] Configure CORS if API is accessed from other domains

### Infrastructure

- [ ] Dockerfile for production (the app builds with `npm run build`, runs with `npm run start`)
- [ ] Docker Compose or orchestration (K8s, ECS, etc.)
- [ ] CI/CD pipeline (GitHub Actions: lint, type-check, test, build, deploy)
- [ ] Reverse proxy (Nginx, Caddy) if running on VPS
- [ ] Process manager (PM2) if running Node directly on VPS

### Observability

- [ ] Structured logging (pino or similar)
- [ ] Error tracking (Sentry)
- [ ] Health check endpoint (`GET /api/health` → 200 OK)
- [ ] Uptime monitoring (UptimeRobot, Better Stack, etc.)

### Performance

- [ ] CDN for static assets (Cloudflare, CloudFront)
- [ ] API rate limiting (middleware or reverse proxy level)
- [ ] Database connection monitoring

## Build & Run

```bash
# Build
npm run build

# Start (listens on port 3000 by default)
npm run start

# Or with custom port
PORT=8080 npm run start
```

The app reads all configuration from environment variables — no build-time secrets needed except `DATABASE_URL` (for schema validation at build time). The database does not need to be reachable at build time.
