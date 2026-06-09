import type { Page } from '@playwright/test';

export const HOME_PATH = '/';

export const expectedTitle = /Creai \| Stay ahead with custom AI solutions/i;
export const expectedDescription = /custom AI solutions/i;

export const mainNavigationLinks = [
  { label: 'AI Systems Framework', path: '/services/ai-systems-framework' },
  { label: 'Custom AI Solutions Factory', path: '/services/custom-ai-solutions-factory' },
  { label: 'Silia Agentic Platform', path: '/services/silia' },
  { label: 'Success stories', path: '/success-stories' },
  { label: 'About us', path: '/about-us' },
  { label: 'Knowledge hub', path: '/knowledge-hub' },
  { label: 'Contact', path: '/contact' },
] as const;

export const keySectionTexts = [
  /AI-powered solutions for human-centered operations/i,
  /AI Systems Framework/i,
  /Custom AI Solutions Factory/i,
  /Silia Agentic Platform/i,
] as const;

export async function dismissCookieDialog(page: Page) {
  const denyButton = page.getByRole('button', { name: /deny/i });

  try {
    await denyButton.click({ timeout: 5_000 });
  } catch {
    // Third-party cookie banner appears only for fresh sessions.
  }
}
