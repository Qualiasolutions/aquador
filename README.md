# Aquad'or Cyprus

Luxury perfume e-commerce site for Aquad'or Cyprus. Built with Next.js 14, Supabase, and Stripe.

**Production:** [aquadorcy.com](https://aquadorcy.com)

## Setup

```bash
npm install
cp .env.example .env.local  # Fill in required values
npm run dev                  # http://localhost:3000
```

## Commands

```bash
npm run dev            # Development server
npm run build          # Production build
npm run lint           # ESLint
npm run type-check     # TypeScript check
npm run test           # Jest unit tests
npm run test:e2e       # Playwright E2E tests
npm run test:all       # All checks (lint + types + jest + playwright)
```

## Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Database:** Supabase (products, blog, orders, admin auth)
- **Payments:** Stripe (checkout sessions + custom perfume PaymentIntents)
- **Styling:** Tailwind CSS, Framer Motion
- **Email:** Resend (contact form)
- **AI:** OpenRouter (fragrance assistant)
- **Monitoring:** Sentry, Vercel Analytics
- **Deployment:** Vercel

## Key Features

- Product catalog with category filtering (women, men, niche, brand originals)
- Custom perfume builder with 3-layer fragrance composition
- Stripe-powered checkout
- AI fragrance assistant chatbot
- Supabase-backed blog with admin CMS
- Admin dashboard (products, orders, customers, blog, categories)
