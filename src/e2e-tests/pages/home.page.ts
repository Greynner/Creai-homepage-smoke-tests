import type { Locator, Page, Response } from '@playwright/test';
import { dismissCookieDialog, HOME_PATH, type keySectionTexts } from '../support/homepage';

export class HomePage {
  readonly logo: Locator;
  readonly heroHeading: Locator;
  readonly mobileMenuButton: Locator;
  readonly getStartedCta: Locator;
  readonly navbarContactCta: Locator;
  readonly visibleSuccessStoriesLink: Locator;

  constructor(private readonly page: Page) {
    // Webflow logo image has empty alt text, so CSS is the least-bad stable selector here.
    this.logo = page.locator('a.navbar11_logo-link img, img.navbar11_logo').first();
    this.heroHeading = page.getByRole('heading', {
      name: /AI-powered solutions for human-centered operations/i,
    });
    this.mobileMenuButton = page.locator('.w-nav-button').first();
    this.getStartedCta = page
      .getByRole('link', { name: /get started/i })
      .filter({ visible: true })
      .first();
    this.navbarContactCta = page
      .locator('a[href="/contact"][location="navbar"]')
      .filter({ visible: true })
      .first();
    this.visibleSuccessStoriesLink = page
      .getByRole('link', { name: /Success stories/i })
      .filter({ visible: true })
      .first();
  }

  async goto(): Promise<Response | null> {
    const response = await this.page.goto(HOME_PATH, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
    await dismissCookieDialog(this.page);
    return response;
  }

  keySection(sectionText: (typeof keySectionTexts)[number]): Locator {
    return this.page.getByText(sectionText).filter({ visible: true }).first();
  }

  async navigateToAiSystemsFramework(): Promise<void> {
    await this.page.getByRole('link', { name: 'AI Systems Framework' }).first().click();
  }

  async navigateToContact(): Promise<void> {
    // Webflow animated wrappers can intercept normal clicks; DOM click keeps the user intent explicit.
    await this.navbarContactCta.evaluate((link: HTMLAnchorElement) => link.click());
  }

  async openMobileMenu(): Promise<void> {
    await this.mobileMenuButton.click({ force: true });
  }
}
