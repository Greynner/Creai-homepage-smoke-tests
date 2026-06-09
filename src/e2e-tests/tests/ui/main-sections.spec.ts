import { expect, test } from '@playwright/test';
import { ContentPage } from '../../pages/content.page';

const mainSectionRoutes = [
  {
    name: 'AI Systems Framework service',
    path: '/services/ai-systems-framework',
    heading: /AI Systems Framework/i,
  },
  {
    name: 'Custom AI Solutions Factory service',
    path: '/services/custom-ai-solutions-factory',
    heading: /Custom AI Solutions Factory/i,
  },
  {
    name: 'Silia Agentic Platform service',
    path: '/services/silia',
    heading: /Silia: Our Agentic Platform/i,
  },
  {
    name: 'Success stories',
    path: '/success-stories',
    heading: /Faster, smoother, safer operations—all with AI/i,
  },
  {
    name: 'About us',
    path: '/about-us',
    heading: /Your trusted leaders in AI-driven solutions/i,
  },
  {
    name: 'Knowledge hub',
    path: '/knowledge-hub',
    heading: /Knowledge hub/i,
  },
] as const;

test.describe('Creai main section frontend smoke tests', () => {
  for (const route of mainSectionRoutes) {
    test(`${route.name} page loads correctly`, async ({ page }) => {
      const contentPage = new ContentPage(page);

      const response = await contentPage.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${route.path}/?$`));
      await expect(contentPage.heading(route.heading)).toBeVisible();
    });
  }
});
