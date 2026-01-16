# Next.js 16 Boilerplate

A production-ready Next.js 16 boilerplate focused on clean code, security, and robustness.

## Documentation

| Document                                     | Purpose                                          |
| -------------------------------------------- | ------------------------------------------------ |
| [`docs/CLAUDE.md`](docs/CLAUDE.md)           | Coding conventions for Claude AI                 |
| [`docs/STRIPE.md`](docs/STRIPE.md)           | Stripe setup, payments, subscriptions, donations |
| [`docs/GOOGLE_AUTH.md`](docs/GOOGLE_AUTH.md) | Google OAuth setup step-by-step                  |

## Tech Stack

| Technology                                      | Version | Purpose             |
| ----------------------------------------------- | ------- | ------------------- |
| [Next.js](https://nextjs.org/)                  | 16.1.2  | React framework     |
| [React](https://react.dev/)                     | 19.2.3  | UI library          |
| [TypeScript](https://www.typescriptlang.org/)   | 5.x     | Type safety         |
| [Tailwind CSS](https://tailwindcss.com/)        | 4.x     | Styling             |
| [shadcn/ui](https://ui.shadcn.com/)             | Latest  | Component library   |
| [ESLint](https://eslint.org/)                   | 9.x     | Code linting        |
| [Prettier](https://prettier.io/)                | 3.8.0   | Code formatting     |
| [Husky](https://typicode.github.io/husky/)      | 9.1.7   | Git hooks           |
| [Framer Motion](https://www.framer.com/motion/) | 12.x    | Animations          |
| [Stripe](https://stripe.com/)                   | 20.x    | Payments (optional) |

## Features

### Enabled

- [x] **Turbopack** - Default bundler with 2-5x faster builds
- [x] **React Compiler** - Automatic memoization for better performance
- [x] **App Router** - Modern file-based routing
- [x] **TypeScript (Strict)** - Full type safety with strict mode enabled
- [x] **Tailwind CSS v4** - Utility-first CSS with automatic class sorting
- [x] **shadcn/ui** - Accessible, customizable components
- [x] **ESLint** - Code quality enforcement with Next.js rules
- [x] **Prettier** - Consistent code formatting with Tailwind plugin
- [x] **Husky + lint-staged** - Pre-commit hooks for quality checks
- [x] **Security headers** - Protection against common web vulnerabilities
- [x] **Error boundaries** - Graceful error handling (error.tsx, global-error.tsx)
- [x] **Layout system** - Navbar, Footer, and responsive layout structure
- [x] **Mobile-first design** - Animated hamburger menu, responsive grids
- [x] **Loading states** - Built-in loading.tsx for Suspense
- [x] **SEO metadata** - OpenGraph, Twitter cards, viewport configuration
- [x] **Path aliases** - Clean imports with `@/*`
- [x] **Authentication** - Better Auth with Google OAuth
- [x] **Testing** - Vitest + React Testing Library
- [x] **Database** - Drizzle ORM with multi-database support
- [x] **API Client** - Typed fetch wrapper with error handling
- [x] **Payments (Optional)** - Stripe integration with subscriptions, donations, and webhooks
- [x] **User Roles** - Role-based access control (admin, paid_user, donor, user)

### Roadmap

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker configuration
- [ ] API rate limiting
- [ ] Logging setup

## Using This Boilerplate

### Option 1: Clone and Reset Git History

```bash
# Clone the boilerplate
git clone https://github.com/your-username/nextjs16-boilerplate.git my-new-project
cd my-new-project

# Remove existing git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from nextjs16-boilerplate"
```

### Option 2: Use as Template (GitHub)

1. Click "Use this template" on the GitHub repo
2. Create your new repository
3. Clone your new repo

### After Cloning - Checklist

1. **Update package.json:**

   ```json
   {
     "name": "your-project-name",
     "version": "0.1.0"
   }
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Update branding:**
   - Replace `public/images/logo.svg` with your logo
   - Update `src/constants/index.ts` with your app name

4. **Set up database:**

   ```bash
   # Update DATABASE_URL in .env.local, then:
   npm run db:push
   ```

5. **Set up Google OAuth:**
   - Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`

6. **Install dependencies and run:**

   ```bash
   npm install
   npm run dev
   ```

7. **Clean up example files (optional):**
   - Delete `src/services/example.ts`
   - Modify `src/db/schema/users.ts` for your needs

## Requirements

- Node.js >= 20.0.0 (see `.nvmrc`)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

> **Note:** Always use port 3000 for local development. OAuth redirect URIs and Better Auth are configured for `http://localhost:3000`. If port 3000 is in use, kill the process first:
>
> ```bash
> lsof -ti:3000 | xargs kill -9
> ```

## Available Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server (Turbopack) |
| `npm run build`         | Build for production                 |
| `npm run start`         | Start production server              |
| `npm run lint`          | Run ESLint                           |
| `npm run lint:fix`      | Run ESLint with auto-fix             |
| `npm run type-check`    | Run TypeScript compiler check        |
| `npm run format`        | Format all files with Prettier       |
| `npm run format:check`  | Check formatting without changes     |
| `npm run test`          | Run tests once                       |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Run tests with coverage report       |
| `npm run db:generate`   | Generate database migrations         |
| `npm run db:migrate`    | Run database migrations              |
| `npm run db:push`       | Push schema changes (dev only)       |
| `npm run db:studio`     | Open Drizzle Studio GUI              |
| `npm run clean`         | Remove .next and out directories     |

## Project Structure

```
src/
├── actions/                # Server actions (database mutations)
├── app/
│   ├── (auth)/login/       # Login page (route group)
│   ├── api/auth/[...all]/  # Better Auth API routes
│   ├── error.tsx           # Error boundary for route segments
│   ├── global-error.tsx    # Root error boundary
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout with Navbar/Footer/Metadata
│   ├── loading.tsx         # Loading state for Suspense
│   ├── not-found.tsx       # 404 page
│   └── page.tsx            # Home page
├── components/
│   ├── auth/               # Auth components (AuthButton)
│   ├── icons/              # Icon components (Google, etc.)
│   ├── layouts/            # Layout components (Navbar, Footer)
│   ├── navigation/         # Mobile navigation (hamburger, panel)
│   └── ui/                 # shadcn/ui components (Button, Card, etc.)
├── constants/              # App constants (APP_NAME, APP_URL, logo config)
├── db/                     # Database connections and schema (Drizzle)
├── hooks/                  # Custom React hooks (useMobileMenu, useIsMobile)
├── lib/                    # Utilities, auth, and API client
├── services/               # API service functions (client-side API calls)
├── test/                   # Test setup and utilities
└── types/                  # TypeScript definitions
public/
└── images/
    └── logo.svg            # App logo (replace with your own)
```

### Recommended Structure (as you scale)

```
src/
├── actions/                # Server actions (database mutations)
├── app/                    # App Router
│   ├── (auth)/             # Auth route group
│   ├── (dashboard)/        # Dashboard route group
│   ├── api/                # API routes
│   └── ...
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   ├── layouts/            # Layout components
│   └── shared/             # Shared/common components
├── db/                     # Database connections and schema
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configs
├── types/                  # TypeScript type definitions
├── constants/              # App constants
└── services/               # API service functions (client-side)
```

## Adding shadcn/ui Components

```bash
# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add dialog dropdown-menu toast

# View all available components
npx shadcn@latest add
```

## Branding & Customization

### Logo

To use your own logo:

1. Add your logo file to `public/images/` (supports `.svg`, `.png`, `.jpg`, `.webp`)
2. Update `src/constants/index.ts`:

```ts
export const APP_LOGO_PATH = "/images/your-logo.svg";
export const APP_LOGO_SIZE = {
  width: 32,
  height: 32,
};
```

The `Logo` component (`src/components/ui/logo.tsx`) automatically:

- Uses `next/image` for optimization
- Applies `dark:invert` for dark mode compatibility (works best with monochrome logos)
- Supports three sizes: `sm` (24px), `md` (32px), `lg` (40px)

### App Name

Update the app name in `src/constants/index.ts` or via environment variable:

```ts
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Your App Name";
```

## TypeScript Configuration

This boilerplate uses strict TypeScript settings for maximum type safety:

| Option                     | Description                              |
| -------------------------- | ---------------------------------------- |
| `strict: true`             | Enable all strict type checks            |
| `noUncheckedIndexedAccess` | Require undefined checks on array access |
| `noUnusedLocals`           | Error on unused local variables          |
| `noUnusedParameters`       | Error on unused function parameters      |

## Security Features

### Headers

The following security headers are configured in `next.config.ts`:

| Header                      | Value                                      | Protection Against                  |
| --------------------------- | ------------------------------------------ | ----------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`      | Downgrade attacks, cookie hijacking |
| `X-Frame-Options`           | `SAMEORIGIN`                               | Clickjacking                        |
| `X-Content-Type-Options`    | `nosniff`                                  | MIME-type sniffing                  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          | Information leakage                 |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()` | Unauthorized feature access         |
| `X-DNS-Prefetch-Control`    | `on`                                       | N/A (performance optimization)      |

Additional security:

- `poweredByHeader: false` - Removes X-Powered-By header

To add Content-Security-Policy (CSP), modify `next.config.ts`:

```ts
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}
```

## SEO Configuration

The boilerplate includes comprehensive SEO metadata in `src/app/layout.tsx`:

- **Title template**: `%s | App Name` for consistent page titles
- **OpenGraph tags**: For social media sharing
- **Twitter cards**: For Twitter/X sharing
- **Viewport configuration**: Responsive design settings
- **Theme color**: Light/dark mode support
- **Robots**: Search engine indexing enabled

Customize by editing `src/constants/index.ts`:

```ts
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "My App";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
```

## Database

This boilerplate uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL, supporting multiple database connections.

### Setup

1. Set up your PostgreSQL database
2. Add the connection string to `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
# Optional: Secondary database
DATABASE_SECONDARY_URL=postgresql://user:password@localhost:5432/analytics
```

3. Push schema to database (development):

```bash
npm run db:push
```

4. Or generate and run migrations (production):

```bash
npm run db:generate
npm run db:migrate
```

### Files

| File                  | Purpose                          |
| --------------------- | -------------------------------- |
| `src/db/index.ts`     | Exports all database connections |
| `src/db/primary.ts`   | Primary PostgreSQL connection    |
| `src/db/secondary.ts` | Secondary database connection    |
| `src/db/schema/`      | Table schemas                    |
| `drizzle.config.ts`   | Drizzle Kit configuration        |

### Usage

```ts
// Import primary database (default)
import { db } from "@/db";

// Or import specific databases
import { primaryDb, secondaryDb } from "@/db";

// Query example
const users = await db.select().from(users);

// Insert example
await db.insert(users).values({ email: "user@example.com", name: "John" });
```

### Multiple Databases

The boilerplate supports multiple database connections for:

- **Read replicas** - Scale reads across multiple databases
- **Analytics** - Separate database for analytics/reporting
- **Multi-tenant** - Different databases per tenant
- **Legacy systems** - Connect to existing databases

```ts
import { primaryDb, secondaryDb } from "@/db";

// Write to primary
await primaryDb.insert(users).values({ ... });

// Read from secondary (replica)
const data = await secondaryDb.select().from(analytics);
```

### Drizzle Studio

Visualize and edit your data with Drizzle Studio:

```bash
npm run db:studio
```

## API Client

A typed fetch wrapper with robust error handling for making API calls.

### Features

- Automatic JSON parsing
- Typed error handling with error codes
- Timeout support
- Retry logic with exponential backoff
- Request/response interceptors

### Usage

```ts
import { createApiClient, ApiException } from "@/lib/api";

// Create client for internal API
const api = createApiClient({
  baseUrl: "/api",
  defaultTimeout: 10000,
});

// Create client for external API
const externalApi = createApiClient({
  baseUrl: "https://api.example.com",
  defaultHeaders: {
    Authorization: `Bearer ${token}`,
  },
});

// Make requests
const users = await api.get<User[]>("/users");
const user = await api.post<User>("/users", { name: "John" });
await api.delete(`/users/${id}`);
```

### Error Handling

```ts
import { ApiException } from "@/lib/api";

try {
  const user = await api.get<User>("/users/123");
} catch (error) {
  if (error instanceof ApiException) {
    switch (error.code) {
      case "UNAUTHORIZED":
        // Redirect to login
        break;
      case "NOT_FOUND":
        // Show 404 message
        break;
      case "RATE_LIMITED":
        // Show "try again later"
        break;
      case "NETWORK_ERROR":
        // Show offline message
        break;
      default:
        // Show generic error
        console.error(error.message);
    }
  }
}
```

### Error Codes

| Code               | Description              |
| ------------------ | ------------------------ |
| `NETWORK_ERROR`    | Network failure, offline |
| `TIMEOUT`          | Request timed out        |
| `UNAUTHORIZED`     | 401 - Not authenticated  |
| `FORBIDDEN`        | 403 - Not authorized     |
| `NOT_FOUND`        | 404 - Resource not found |
| `VALIDATION_ERROR` | 422 - Invalid input      |
| `RATE_LIMITED`     | 429 - Too many requests  |
| `SERVER_ERROR`     | 5xx - Server error       |

### Retry Logic

```ts
// Retry failed requests (server errors only)
const data = await api.get<Data>("/endpoint", {
  retries: 3, // Retry up to 3 times
  retryDelay: 1000, // Start with 1s delay (exponential backoff)
});
```

## Stripe Payments (Optional)

This boilerplate includes optional [Stripe](https://stripe.com/) integration for handling subscriptions, one-time payments, and donations. **Stripe is optional** - if you don't need payments, simply don't set the Stripe environment variables.

For complete setup instructions, see [`docs/STRIPE.md`](docs/STRIPE.md).

### Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Add keys to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

4. Push database schema:

```bash
npm run db:push
```

5. Set up webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`, `product.*`, `price.*`

### Local Development

Use Stripe CLI to forward webhooks locally:

```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret to your `.env.local`.

### Files

| File                                  | Purpose                                   |
| ------------------------------------- | ----------------------------------------- |
| `src/lib/stripe/server.ts`            | Server-side Stripe client and helpers     |
| `src/lib/stripe/client.ts`            | Client-side Stripe.js loader              |
| `src/db/schema/stripe.ts`             | Database schema for Stripe data           |
| `src/app/api/stripe/webhook/route.ts` | Webhook handler                           |
| `src/actions/stripe.ts`               | Server actions for checkout, portal, etc. |

### Usage

**Create checkout session (subscription):**

```tsx
"use client";
import { createCheckout } from "@/actions";

function PricingButton({ priceId }: { priceId: string }) {
  return (
    <form action={() => createCheckout(priceId)}>
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

**Open customer portal:**

```tsx
"use client";
import { openCustomerPortal } from "@/actions";

function ManageSubscriptionButton() {
  return (
    <form action={openCustomerPortal}>
      <button type="submit">Manage Subscription</button>
    </form>
  );
}
```

**Check subscription status:**

```tsx
import { getMySubscription, hasActiveSubscription } from "@/actions";

// In a Server Component or Server Action
const subscription = await getMySubscription();
const isActive = await hasActiveSubscription();
```

### Database Tables

| Table                 | Purpose                         |
| --------------------- | ------------------------------- |
| `stripe_customer`     | Links users to Stripe customers |
| `stripe_product`      | Synced product catalog          |
| `stripe_price`        | Synced pricing tiers            |
| `stripe_subscription` | Active subscriptions            |
| `stripe_payment`      | One-time payments               |

### Webhook Events Handled

| Event                                   | Action                                    |
| --------------------------------------- | ----------------------------------------- |
| `checkout.session.completed`            | Creates customer and subscription records |
| `customer.subscription.created/updated` | Updates subscription status               |
| `customer.subscription.deleted`         | Marks subscription as canceled            |
| `invoice.paid`                          | Confirms subscription active              |
| `invoice.payment_failed`                | Marks subscription past due               |
| `product.created/updated`               | Syncs product data                        |
| `price.created/updated`                 | Syncs price data                          |

## Testing

This boilerplate uses [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing.

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Writing Tests

Tests are co-located with components using the `.test.tsx` extension:

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx    # Tests for Button
├── hooks/
│   ├── use-mobile-menu.ts
│   └── use-mobile-menu.test.ts # Tests for hook
```

### Example Component Test

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Button } from "./button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Example Hook Test

```tsx
import { renderHook, act } from "@testing-library/react";
import { useMobileMenu } from "./use-mobile-menu";

it("toggles menu open and closed", () => {
  const { result } = renderHook(() => useMobileMenu());

  act(() => result.current.toggleMenu());
  expect(result.current.isOpen).toBe(true);

  act(() => result.current.toggleMenu());
  expect(result.current.isOpen).toBe(false);
});
```

### Test Utilities

Use the custom render from `@/test/test-utils` which includes `userEvent` setup:

```tsx
import { render, screen } from "@/test/test-utils";

const { user } = render(<MyComponent />);
await user.click(screen.getByRole("button"));
```

## Authentication

This boilerplate uses [Better Auth](https://www.better-auth.com/) for authentication with Google OAuth.

For complete setup instructions, see [`docs/GOOGLE_AUTH.md`](docs/GOOGLE_AUTH.md).

### Quick Setup

1. Create a Google OAuth application at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
3. Copy your Client ID and Client Secret to `.env.local`

### Files

| File                                  | Description                    |
| ------------------------------------- | ------------------------------ |
| `src/lib/auth.ts`                     | Server-side auth configuration |
| `src/lib/auth-client.ts`              | Client-side auth hooks         |
| `src/app/api/auth/[...all]/`          | Auth API routes                |
| `src/app/(auth)/login/page.tsx`       | Login page                     |
| `src/components/auth/auth-button.tsx` | Auth button (sign in/out)      |

The `AuthButton` component is already integrated into the Navbar and mobile menu. It automatically shows "Sign in" or "Sign out" based on session state.

### Usage

```tsx
// Client-side
import { signIn, signOut, useSession } from "@/lib/auth-client";

// Sign in with Google
await signIn.social({ provider: "google" });

// Sign out
await signOut();

// Get session
const { data: session } = useSession();
```

## Environment Variables

Create a `.env.local` file for local development:

```bash
cp .env.example .env.local
```

Available variables:

| Variable                             | Description                   | Required     |
| ------------------------------------ | ----------------------------- | ------------ |
| `NEXT_PUBLIC_APP_URL`                | Application URL               | No           |
| `NEXT_PUBLIC_APP_NAME`               | Application name              | No           |
| `BETTER_AUTH_SECRET`                 | Auth secret (32+ chars)       | Yes          |
| `BETTER_AUTH_URL`                    | Auth base URL                 | Yes          |
| `GOOGLE_CLIENT_ID`                   | Google OAuth client ID        | Yes          |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth client secret    | Yes          |
| `DATABASE_URL`                       | PostgreSQL connection string  | Yes          |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key        | For payments |
| `STRIPE_SECRET_KEY`                  | Stripe secret key             | For payments |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret | For payments |

**Important:** Never commit `.env.local` or any file containing secrets.

## Pre-commit Hooks

Husky + lint-staged runs on every commit:

1. **TypeScript/JavaScript files**: ESLint fix + Prettier format
2. **JSON/CSS/Markdown files**: Prettier format

To bypass hooks (not recommended):

```bash
git commit --no-verify -m "message"
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

### Other Platforms

- AWS Amplify
- Netlify
- Railway
- Render

## Best Practices

### Code Quality

- TypeScript strict mode is enabled - don't use `any`
- Follow ESLint rules - run `npm run lint:fix` to auto-fix
- Use meaningful variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks

### Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Sanitize data before rendering
- Keep dependencies updated

### Performance

- React Compiler handles memoization automatically
- Use `next/image` for optimized images (AVIF/WebP)
- Loading states are built-in with `loading.tsx`
- Use Suspense for code splitting
- Minimize client-side JavaScript

### UI/UX

- **Cursor pointer on buttons** - Always ensure clickable elements show `cursor-pointer` on hover. The Button component includes this by default.
- Use proper `aria-label` for icon-only buttons
- Provide loading states for async actions
- Ensure sufficient color contrast for accessibility

## Responsive Design

The boilerplate is built mobile-first with responsive breakpoints:

| Breakpoint | Size     | Description   | Key Changes                              |
| ---------- | -------- | ------------- | ---------------------------------------- |
| Default    | < 640px  | Mobile        | Single column, hamburger menu            |
| `sm`       | ≥ 640px  | Small tablets | Larger text, wider cards                 |
| `md`       | ≥ 768px  | Tablets       | Desktop nav, 2-4 col grids, no hamburger |
| `lg`       | ≥ 1024px | Laptops       | 3-col grids, larger hero text            |
| `xl`       | ≥ 1280px | Desktops      | Max-width 5xl content, extra padding     |
| `2xl`      | ≥ 1536px | Large screens | Max-width 6xl content                    |

### Responsive Patterns Used

- **Container**: `max-w-screen-2xl` ensures content doesn't stretch too wide on ultrawide monitors
- **Padding**: Progressive padding `px-4 sm:px-6 lg:px-8` for breathing room
- **Typography**: Scales from `text-3xl` → `text-4xl` → `text-5xl` → `text-6xl` for hero
- **Grids**: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3` for cards
- **Navigation**: Hamburger menu (`md:hidden`) switches to inline nav (`hidden md:flex`)

### Mobile Navigation

- **Animated hamburger button** - Transforms to X on open
- **Slide-in panel** - Multi-layer animated panel with Framer Motion
- **Auto-close behaviors**:
  - Closes on route change
  - Closes on ESC key
  - Closes on resize to desktop
  - Body scroll locked when open

### Responsive Hooks

```tsx
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileMenu } from "@/hooks/use-mobile-menu";

// Detect mobile viewport
const isMobile = useIsMobile();

// Control mobile menu state
const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
```

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes: `npm run type-check && npm run lint && npm run build`
4. Update documentation as needed

## License

MIT
