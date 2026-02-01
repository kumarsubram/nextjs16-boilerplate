# Next Steps

Improvements to the boilerplate template.

## Roadmap

### Testing

- [ ] E2E testing with Playwright
- [ ] API route integration tests
- [ ] Database test utilities (test fixtures, cleanup)

### Features

- [ ] Email integration (Resend or similar)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] User settings page
- [ ] Admin dashboard
- [ ] Pricing page with Stripe product/price display

### Polish

- [ ] VS Code recommended extensions and settings
- [ ] More shadcn/ui components pre-installed (Toast, Dialog, DropdownMenu)

## How-To Guides

### Adding a New Subscription Tier

To add a tier (e.g., "business"):

1. Add to `userPlanEnum` in `src/db/schema/users.ts`
2. Add to `userPlans` in `src/lib/validations/roles.ts`
3. Create a Stripe product with `metadata.plan = "business"`
4. Run `npm run db:push`

The webhook automatically reads `metadata.plan` from the Stripe product and sets the user's plan.

### Adding a New Auth Provider

Better Auth supports many providers. To add one (e.g., GitHub):

1. Add credentials to `.env.local`
2. Update `socialProviders` in `src/lib/auth.ts`
3. Add a sign-in button in `src/app/(auth)/login/login-form.tsx`
4. Add the callback URL in the provider's dashboard

See [Better Auth docs](https://www.better-auth.com/docs) for the full list.

### Adding a New Database Table

1. Create `src/db/schema/posts.ts` with your Drizzle table definition
2. Export from `src/db/schema/index.ts`
3. Add seed data in `src/db/seed.ts` (optional)
4. Run `npm run db:push`

See the example in `docs/CLAUDE.md` under "Adding a New Table".
