import type { Locator, Page } from '@playwright/test';
import type { ContactFormData } from '../support/contact-data';

export class ContactPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly purposeSelect: Locator;
  readonly descriptionInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Let’s talk/i });
    this.form = page.getByRole('form', { name: /Contact Form/i });
    this.nameInput = page.getByPlaceholder('Name');
    this.emailInput = page.getByPlaceholder('example@email.com');
    this.purposeSelect = page.locator('#purpose');
    this.descriptionInput = page.getByPlaceholder('Max 400 characters');
    this.termsCheckbox = page.locator('input[type="checkbox"][required]').first();
    this.submitButton = page.getByRole('button', { name: /^Contact$/i });
  }

  async fillForm(data: ContactFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.purposeSelect.selectOption({ label: data.purpose });
    await this.descriptionInput.fill(data.description);
    await this.termsCheckbox.evaluate((checkbox: HTMLInputElement) => {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}
