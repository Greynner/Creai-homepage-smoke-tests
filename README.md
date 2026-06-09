# Creai homepage smoke tests

Smoke test automation for the public [creai.mx](https://www.creai.mx) homepage, built with **Playwright + TypeScript** and executed with **Bun**.

## Stack

- Bun
- Playwright Test
- TypeScript
- Biome
- Optional Passmark AI regression demo

## Installation

```bash
bun install
bunx playwright install
```

## Instructions to run the tests locally

From the repository root, run:

```bash
bun install
bunx playwright install
bun run test
```

This executes the deterministic suite: integration, UI and mobile tests. The optional Passmark AI demo is intentionally not executed by default.

## Running tests

```bash
# Full deterministic suite
bun run test

# Integration tests: HTTP, metadata, routes and critical assets
bun run test:integration

# Frontend tests: real browser UI and mobile viewport checks
bun run test:frontend

# Optional Passmark AI frontend test.
# Recommended: configure .env with OPENAI_API_KEY for CUA mode.
# Alternatives: AI_GATEWAY_API_KEY, OPENROUTER_API_KEY,
# or ANTHROPIC_API_KEY + GOOGLE_GENERATIVE_AI_API_KEY.
bun run test:passmark

# Lint / format
bun run lint
bun run format
```

## Project structure

```txt
src/
  e2e-tests/
    pages/             # Shared Page Object Models
    support/           # Shared data/helpers
    tests/
      ui/              # Desktop/browser E2E tests
      mobile/          # Mobile viewport E2E tests
      integration/     # Request/API-style checks without browser UI
      ai/              # Optional Passmark AI demo
```

## Solution approach

The core suite is built with **traditional Playwright + Page Object Model (POM)**. This is the stable, maintainable and predictable foundation of the project: explicit selectors, deterministic assertions, and a clear separation between integration, UI and mobile coverage.

**Passmark** was added as an **optional demonstration** of natural-language testing. The goal is not to replace the POM-based suite, but to show the team the potential future direction of QA with AI: describing user flows as human-readable steps and letting an AI layer help execute them.

For that reason, Passmark lives separately in:

```txt
src/e2e-tests/tests/ai/homepage.passmark.spec.ts
```

It does not run by default. It only runs explicitly with:

```bash
bun run test:passmark
```

This avoids spending AI credits during the normal suite and keeps the project stable for any reviewer.

## What the tests validate

### Integration tests

- Homepage responds with HTTP `200`.
- Response is HTML.
- Expected SEO metadata is present.
- Main navigation routes are exposed in the HTML.
- Main routes are reachable.
- Critical static assets load without HTTP errors.
- Contact page exposes the expected form contract.
- Homepage internal links are reachable.

### Frontend/E2E tests

Frontend tests use Page Object Model classes from `src/e2e-tests/pages` to encapsulate selectors and actions.

This is the recommended suite for day-to-day maintenance.

- Homepage loads in Chromium, Firefox and WebKit/Safari.
- Browser console has no errors.
- Logo, CTA and key sections are visible.
- The menu navigates to a service page.
- The contact CTA navigates to `/contact`.
- The `Get started` CTA group exposes the contact action.
- Contact form accepts smoke test data without submitting a real lead.
- iPhone X and Android Pixel viewports keep key elements visible.
- Mobile menu opens and exposes navigation actions.
- Main pages load correctly:
  - AI Systems Framework
  - Custom AI Solutions Factory
  - Silia Agentic Platform
  - Success stories
  - About us
  - Knowledge hub

### Passmark AI demo

Passmark was added as a proposal/demo for how QA could evolve with AI and natural-language testing.

The test describes the flow in human-readable steps:

```ts
steps: [
  { description: 'Navigate to https://www.creai.mx' },
  { description: 'Dismiss the cookies dialog if it is visible' },
  { description: 'Confirm the Get started CTA is visible in the top navigation' },
  { description: 'Click the Contact button next to Get started' },
]
```

The final result is still validated with deterministic Playwright assertions to keep the test stable.

To run it with OpenAI:

```env
OPENAI_API_KEY=your-key
PASSMARK_LOG_LEVEL=error
```

`PASSMARK_LOG_LEVEL=error` hides non-actionable warnings when Redis is not configured. Redis would only be needed if we wanted to cache AI steps between runs.

## Optional variables

You can change the target site with:

```bash
BASE_URL=https://www.creai.mx bun run test
```

## Report

After running tests:

```bash
bun run report
```
