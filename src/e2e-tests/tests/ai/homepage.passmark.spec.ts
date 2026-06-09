import { expect, test } from '@playwright/test';
import { runSteps } from 'passmark';

const hasOpenAiCredentials = Boolean(process.env.OPENAI_API_KEY);
const hasSnapshotModeCredentials = Boolean(
  process.env.AI_GATEWAY_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    (process.env.ANTHROPIC_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY),
);
const shouldRunPassmark = process.env.RUN_PASSMARK === 'true';
const hasPassmarkCredentials =
  shouldRunPassmark && (hasOpenAiCredentials || hasSnapshotModeCredentials);

test.describe('Creai homepage Passmark AI frontend smoke tests', () => {
  test.skip(
    !hasPassmarkCredentials,
    'Passmark AI tests require RUN_PASSMARK=true plus OPENAI_API_KEY, AI_GATEWAY_API_KEY, OPENROUTER_API_KEY, or Anthropic + Google keys.',
  );

  test('AI validates the Get started/contact CTA flow', async ({ page }) => {
    test.setTimeout(120_000);

    await runSteps({
      page,
      userFlow: 'Creai homepage contact CTA flow',
      ai: hasOpenAiCredentials ? { mode: 'cua', gateway: 'none' } : undefined,
      steps: [
        { description: 'Navigate to https://www.creai.mx' },
        { description: 'Dismiss the cookies dialog if it is visible' },
        { description: 'Confirm the Get started CTA is visible in the top navigation' },
        { description: 'Click the Contact button next to Get started' },
      ],
      test,
    });

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.getByRole('heading', { name: /Let’s talk/i })).toBeVisible();
    await expect(page.getByRole('form', { name: /Contact Form/i })).toBeVisible();
    await expect(page.getByPlaceholder('Name')).toBeVisible();
    await expect(page.getByPlaceholder('example@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Max 400 characters')).toBeVisible();
  });
});
