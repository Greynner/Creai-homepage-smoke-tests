import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/home.page';

test.describe('Creai homepage mobile smoke tests', () => {
  test('keeps key elements visible on an iPhone X viewport', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.heroHeading).toBeVisible();
  });

  test('opens mobile menu and exposes navigation actions', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.mobileMenuButton).toBeVisible();
    await homePage.openMobileMenu();

    await expect(homePage.navbarContactCta).toBeVisible();
    await expect(homePage.visibleSuccessStoriesLink).toBeVisible();
  });
});
