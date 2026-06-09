import { expect, test } from '@playwright/test';
import { ContactPage } from '../../pages/contact.page';
import { HomePage } from '../../pages/home.page';
import { smokeContactFormData } from '../../support/contact-data';
import { keySectionTexts } from '../../support/homepage';

test.describe('Creai homepage frontend smoke tests', () => {
  test('loads the homepage without browser console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    const homePage = new HomePage(page);
    const response = await homePage.goto();

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Creai \| Stay ahead with custom AI solutions/i);
    expect(consoleErrors, `Unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('shows brand, primary CTA and key homepage sections', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.getStartedCta).toBeVisible();
    await expect(homePage.navbarContactCta).toBeVisible();

    for (const sectionText of keySectionTexts) {
      await expect(homePage.keySection(sectionText)).toBeVisible();
    }
  });

  test('navigates from the main menu to a service detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.navigateToAiSystemsFramework();

    await expect(page).toHaveURL(/\/services\/ai-systems-framework\/?$/);
    await expect(
      page.getByRole('heading', { name: /AI Systems Framework/i }).first(),
    ).toBeVisible();
  });

  test('contact CTA navigates to the contact page', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);
    await homePage.goto();

    await expect(homePage.navbarContactCta).toBeVisible();
    await homePage.navigateToContact();

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(contactPage.heading).toBeVisible();
    await expect(contactPage.form).toBeVisible();
  });

  test('Get started CTA group exposes the contact action', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);
    await homePage.goto();

    await expect(homePage.getStartedCta).toBeVisible();
    await expect(homePage.navbarContactCta).toBeVisible();
    await homePage.navigateToContact();

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(contactPage.heading).toBeVisible();
    await expect(contactPage.form).toBeVisible();
  });

  test('contact form accepts smoke test data', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);
    await homePage.goto();
    await homePage.navigateToContact();

    await contactPage.fillForm(smokeContactFormData);

    await expect(contactPage.nameInput).toHaveValue(smokeContactFormData.name);
    await expect(contactPage.emailInput).toHaveValue(smokeContactFormData.email);
    await expect(contactPage.purposeSelect).toHaveValue(/Custom AI Solutions Factory/i);
    await expect(contactPage.descriptionInput).toHaveValue(smokeContactFormData.description);
    await expect(contactPage.termsCheckbox).toBeChecked();
    await expect(contactPage.submitButton).toBeVisible();
  });
});
