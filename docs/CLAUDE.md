# CLAUDE.md

This file provides context for Claude (AI assistant) to work effectively with this codebase.

## Project Overview

Next.js 16 boilerplate with React 19, TypeScript strict mode, Tailwind CSS v4, and shadcn/ui components. Supports authentication (Better Auth + Google OAuth), payments (Stripe - optional), and role-based access control.

## Documentation

**IMPORTANT**: Always check these docs for the latest setup instructions:

| Document              | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `docs/CLAUDE.md`      | This file - coding conventions for Claude        |
| `docs/STRIPE.md`      | Stripe setup, payments, subscriptions, donations |
| `docs/GOOGLE_AUTH.md` | Google OAuth setup step-by-step                  |
| `README.md`           | Project overview and quick start                 |

When updating features, also update the relevant documentation.

## Key Commands

```bash
npm run dev          # Start dev server (always use port 3000)
npm run build        # Build for production
npm run lint:fix     # Fix linting issues
npm run type-check   # Check TypeScript types
npm run test         # Run tests
npm run db:push      # Push schema to database (dev)
npm run db:generate  # Generate migrations (prod)
```

## Project Structure

```
src/
├── actions/          # Server actions (database mutations, auth, payments)
├── app/              # Next.js App Router pages and API routes
├── components/
│   ├── ui/           # shadcn/ui components (Button, Card, etc.)
│   ├── auth/         # Auth-related components
│   ├── layouts/      # Navbar, Footer
│   └── navigation/   # Mobile menu components
├── db/               # Drizzle ORM database connections and schema
├── hooks/            # Custom React hooks
├── lib/              # Utilities (auth, api client, stripe, validations, utils)
├── services/         # API service functions (client-side API calls)
├── constants/        # App constants
├── test/             # Test setup and utilities
└── types/            # TypeScript type definitions
docs/
├── CLAUDE.md         # This file
├── STRIPE.md         # Stripe integration guide
└── GOOGLE_AUTH.md    # Google OAuth setup guide
```

## Conventions

### File Naming

- Components: `kebab-case.tsx` (e.g., `auth-button.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-mobile-menu.ts`)
- Actions: `kebab-case.ts` (e.g., `user-profile.ts`)
- Tests: `*.test.tsx` or `*.test.ts` co-located with source
- Types: `kebab-case.ts` in `src/types/`

### Components

- Use `"use client"` directive only when needed (hooks, browser APIs, event handlers)
- Server Components are the default - prefer them when possible
- Place reusable UI components in `src/components/ui/`
- Feature-specific components go in `src/components/[feature]/`

### Styling

- Use Tailwind CSS classes directly in components
- Mobile-first: start with mobile styles, add `sm:`, `md:`, `lg:`, `xl:`, `2xl:` for larger screens
- Use `cn()` utility from `@/lib/utils` for conditional classes
- All clickable elements must have `cursor-pointer`

### TypeScript

- Strict mode enabled - avoid `any`
- Use `interface` for object shapes, `type` for unions/intersections
- Export types alongside their related code
- Use `noUncheckedIndexedAccess` - always check array/object access

## User Roles

The boilerplate includes a role system:

| Role        | Description                    |
| ----------- | ------------------------------ |
| `admin`     | Full access, manually assigned |
| `paid_user` | Active subscription            |
| `donor`     | Made a donation                |
| `user`      | Free tier (default)            |

### Checking Roles

```typescript
import { isAdmin, hasPaidAccess, isDonor, getMyRole } from "@/actions";

// Check access levels
const isAdminUser = await isAdmin();
const canAccessPremium = await hasPaidAccess(); // admin OR paid_user
const hasSupported = await isDonor(); // admin, paid_user, OR donor
```

### Protecting Pages

```typescript
import { hasPaidAccess } from "@/actions";
import { redirect } from "next/navigation";

export default async function PremiumPage() {
  if (!(await hasPaidAccess())) redirect("/pricing");
  return <div>Premium content</div>;
}
```

## Database (Drizzle ORM)

### Schema Files

- `src/db/schema/auth.ts` - Better Auth tables (user, session, account)
- `src/db/schema/users.ts` - User profile with roles
- `src/db/schema/stripe.ts` - Stripe tables (customers, subscriptions, payments)

### Adding a New Table

```typescript
// 1. Create src/db/schema/posts.ts
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// 2. Export from src/db/schema/index.ts
export * from "./posts";

// 3. Run: npm run db:push
```

## Server Actions

### Pattern

```typescript
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { validateInput, mySchema } from "@/lib/validations";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function myAction(data: MyInput): Promise<ActionResult<MyType>> {
  try {
    // 1. Authenticate
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // 2. Validate input (REQUIRED for all user data)
    const validation = validateInput(mySchema, data);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const validatedData = validation.data;

    // 3. Do work with validatedData
    // 4. Revalidate if needed: revalidatePath("/path");
    // 5. Return result
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Failed" };
  }
}
```

### Available Actions

**User Profile:**

```typescript
import { getMyProfile, updateMyProfile, deleteMyProfile } from "@/actions";
```

**Roles:**

```typescript
import {
  getMyRole,
  isAdmin,
  hasPaidAccess,
  isDonor,
  updateUserRole,
} from "@/actions";
```

**Stripe (optional):**

```typescript
import {
  isStripeAvailable, // Check if Stripe is configured
  createSubscriptionCheckout, // Subscription checkout
  createDonationCheckout, // Donation checkout
  openCustomerPortal, // Manage subscription
  getMySubscription, // Get subscription
  getMyDonations, // Get donations
  cancelMySubscription, // Cancel
  hasActiveSubscription, // Check status
} from "@/actions";
```

## Input Validation (Zod 4)

**IMPORTANT**: All user input MUST be validated with Zod schemas before processing.

This project uses [Zod 4](https://zod.dev/v4) for schema validation. Zod 4 is faster and more type-efficient than previous versions.

### Validation Files

- `src/lib/validations/index.ts` - Core utilities and exports
- `src/lib/validations/user-profile.ts` - User profile schemas
- `src/lib/validations/roles.ts` - Role-related schemas

### Using Validation

```typescript
import { validateInput, updateProfileSchema } from "@/lib/validations";

// In a server action:
const validation = validateInput(updateProfileSchema, data);
if (!validation.success) {
  return { success: false, error: validation.error };
}
// Use validation.data (typed and validated)
```

### Creating New Schemas

```typescript
// 1. Create src/lib/validations/posts.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title required").max(200),
  content: z.string().min(1, "Content required"),
  published: z.boolean().default(false),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// 2. Export from src/lib/validations/index.ts
export * from "./posts";

// 3. Use in server action
import {
  validateInput,
  createPostSchema,
  type CreatePostInput,
} from "@/lib/validations";

export async function createPost(data: CreatePostInput) {
  const validation = validateInput(createPostSchema, data);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }
  // ... use validation.data
}
```

### Common Patterns

```typescript
import { z, patterns } from "@/lib/validations";

// Use built-in patterns
patterns.uuid; // UUID v4
patterns.email; // Valid email
patterns.url; // Valid URL
patterns.nonEmptyString;
patterns.positiveInt;
patterns.nonNegativeInt;

// Common schema patterns
z.string().max(500); // Max length
z.string().url().optional(); // Optional URL
z.enum(["a", "b", "c"]); // Enum values
z.number().int().positive(); // Positive integer
z.string().nullable().optional(); // Can be null or undefined
```

## Stripe (Optional)

Stripe is optional. If `STRIPE_SECRET_KEY` is not set, payment features are disabled.

### Check if Available

```typescript
import { isStripeAvailable } from "@/actions";

const stripeEnabled = await isStripeAvailable();
```

### Subscription Checkout

```typescript
"use client";
import { createSubscriptionCheckout } from "@/actions";

<form action={() => createSubscriptionCheckout("price_xxx")}>
  <button type="submit">Subscribe</button>
</form>
```

### Donation Checkout

```typescript
"use client";
import { createDonationCheckout } from "@/actions";

<form action={() => createDonationCheckout("price_xxx")}>
  <button type="submit">Donate $10</button>
</form>
```

### Files

- `src/lib/stripe/server.ts` - Server-side Stripe client
- `src/lib/stripe/client.ts` - Client-side Stripe.js loader
- `src/db/schema/stripe.ts` - Database tables
- `src/app/api/stripe/webhook/route.ts` - Webhook handler
- `src/actions/stripe.ts` - Server actions

See `docs/STRIPE.md` for complete setup guide.

## Authentication

Uses Better Auth with Google OAuth. See `docs/GOOGLE_AUTH.md` for setup.

### Server-side

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/login");
```

### Client-side

```typescript
import { useSession, signIn, signOut } from "@/lib/auth-client";

const { data: session } = useSession();
await signIn.social({ provider: "google" });
await signOut();
```

## Testing

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";

describe("MyComponent", () => {
  it("does something", async () => {
    const onClick = vi.fn();
    const { user } = render(<MyComponent onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Common Patterns

### Protected API Route

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handle request
}
```

### Role-Protected API Route

```typescript
import { isAdmin } from "@/actions";

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  // ... admin-only logic
}
```

### Loading State

```typescript
"use client";
import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return <Loader2 className="h-6 w-6 animate-spin" />;
}
```

## Environment Variables

Required:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (32+ chars)
- `BETTER_AUTH_URL` - Auth base URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

Optional (for payments):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

## Don'ts

- Don't use `any` type - find the proper type or use `unknown`
- Don't skip TypeScript errors with `@ts-ignore`
- Don't commit `.env.local` or secrets
- Don't use `var` - use `const` or `let`
- Don't forget `cursor-pointer` on clickable elements
- Don't run dev server on ports other than 3000 (OAuth breaks)
- Don't use relative imports outside of the same directory - use `@/` alias
- Don't modify Stripe integration without updating `docs/STRIPE.md`
- Don't modify auth without updating `docs/GOOGLE_AUTH.md`
- Don't accept user input without Zod validation - always validate in server actions
