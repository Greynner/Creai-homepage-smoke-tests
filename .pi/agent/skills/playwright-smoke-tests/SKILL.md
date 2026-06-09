# Playwright Smoke Tests Skill

Use for maintaining this repository's smoke test suite.

## Commands

- Install: `bun install && bunx playwright install`
- All tests: `bun run test`
- Integration only: `bun run test:integration`
- Frontend only: `bun run test:frontend`
- Optional Passmark AI: `bun run test:passmark`
- Lint: `bun run lint`

## Repository conventions

- Integration tests live in `src/e2e-tests/tests/integration` and use Playwright `request` when possible.
- UI specs live in `src/e2e-tests/tests/ui`; mobile specs live in `src/e2e-tests/tests/mobile`.
- Optional AI/Passmark specs live in `src/e2e-tests/tests/ai`.
- Page Object Models live in `src/e2e-tests/pages`; keep selectors/actions there instead of duplicating them in specs.
- Shared constants/helpers live in `src/e2e-tests/support`.
- Keep TypeScript strict and Biome-clean.
- Prefer role/text locators; use CSS selectors only for non-accessible Webflow elements such as the logo image or mobile menu button.
- Passmark AI specs are optional, separated behind `RUN_PASSMARK=true`, and must not spend AI credits during the default suite.

## Before changing tests

1. Confirm whether the change belongs to integration or frontend/E2E coverage.
2. For frontend/E2E changes, add selectors/actions to a POM first.
3. Keep deterministic smoke tests fast and high-signal.
4. Run the narrow script first, then `bun run test` before handoff.
