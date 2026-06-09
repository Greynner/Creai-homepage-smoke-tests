# Grug Brain Repo Skill

Use this skill to keep the repository simple, obvious, and easy to maintain.

## Principles

- Prefer boring Playwright APIs over custom abstractions.
- Keep test intent visible in the test file.
- Add helpers only when duplication hides intent.
- Avoid fragile selectors when an accessible role/name exists.
- Separate browser behavior tests from request/integration checks.
- Do not over-test Webflow implementation details.
- Optimize for a reviewer who runs `bun install && bun run test`.

## Test writing checklist

1. Name the behavior being validated.
2. Keep one primary assertion theme per test.
3. Use stable public URLs and user-visible text.
4. Keep retries and traces configured in Playwright, not inside tests.
5. If a selector becomes complex, document why it is necessary.
