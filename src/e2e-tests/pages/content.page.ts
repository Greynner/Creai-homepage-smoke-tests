import type { Locator, Page, Response } from '@playwright/test';
import { dismissCookieDialog } from '../support/homepage';

export class ContentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<Response | null> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
    await dismissCookieDialog(this.page);
    return response;
  }

  heading(name: RegExp): Locator {
    return this.page.getByRole('heading', { name }).first();
  }
}
