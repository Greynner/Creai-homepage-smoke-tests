import { expect, test } from '@playwright/test';
import { expectedDescription, expectedTitle, mainNavigationLinks } from '../../support/homepage';

function uniqueInternalPathsFrom(html: string) {
  return [...html.matchAll(/href="(\/[^"#?]+)"/g)]
    .map((match) => match[1].replace(/\/$/, '') || '/')
    .filter((path) => !path.startsWith('//'))
    .filter((path) => !path.includes('/es-mx'))
    .filter((path, index, paths) => paths.indexOf(path) === index);
}

test.describe('Creai homepage integration smoke tests', () => {
  test('responds successfully with HTML and expected SEO metadata', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');

    const html = await response.text();
    await expect(html).toContain('<html');
    await expect(html).toMatch(expectedTitle);
    await expect(html).toMatch(expectedDescription);
    await expect(html).toContain('href="https://www.creai.mx/es-mx"');
  });

  test('exposes the main navigation routes in the rendered document', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();

    for (const link of mainNavigationLinks.filter((link) => link.label !== 'Contact')) {
      expect(html, `Expected homepage HTML to include route ${link.path}`).toContain(
        `href="${link.path}"`,
      );
    }
  });

  test('main navigation destinations are reachable', async ({ request }) => {
    for (const link of mainNavigationLinks.slice(0, 6)) {
      const response = await request.get(link.path, { maxRedirects: 2 });
      expect(response.status(), `${link.label} should be reachable`).toBeLessThan(400);
      expect(response.headers()['content-type'], `${link.label} should return HTML`).toContain(
        'text/html',
      );
    }
  });

  test('loads critical static assets referenced by the homepage', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();
    const assetUrls = [
      ...html.matchAll(/(?:src|href)="(https:\/\/cdn\.prod\.website-files\.com[^"]+)"/g),
    ]
      .map((match) => match[1])
      .filter((url) => /\.(css|js|png|jpg|jpeg|webp|svg)(\?|$)/i.test(url));

    expect(assetUrls.length).toBeGreaterThan(0);

    for (const assetUrl of [...new Set(assetUrls)].slice(0, 10)) {
      const assetResponse = await request.get(assetUrl);
      expect(assetResponse.status(), `${assetUrl} should load`).toBeLessThan(400);
    }
  });

  test('declares expected alternate language links', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();

    expect(html).toContain('rel="alternate" hrefLang="x-default" href="https://www.creai.mx/"');
    expect(html).toContain('rel="alternate" hrefLang="en" href="https://www.creai.mx/"');
    expect(html).toContain('rel="alternate" hrefLang="es-MX" href="https://www.creai.mx/es-mx"');
  });

  test('contact page exposes the expected form contract', async ({ request }) => {
    const response = await request.get('/contact');
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(html).toContain('Contact Form');
    expect(html).toContain('placeholder="Name"');
    expect(html).toContain('placeholder="example@email.com"');
    expect(html).toContain('Select one...');
    expect(html).toContain('placeholder="Max 400 characters"');
    expect(html).toContain('I accept the');
    expect(html).toContain('Terms and Conditions');
  });

  test('homepage internal links are reachable', async ({ request }) => {
    const response = await request.get('/');
    const html = await response.text();
    const internalPaths = uniqueInternalPathsFrom(html);

    expect(internalPaths.length).toBeGreaterThan(0);

    for (const path of internalPaths) {
      const linkResponse = await request.get(path, { maxRedirects: 2 });
      expect(linkResponse.status(), `${path} should be reachable`).toBeLessThan(400);
    }
  });
});
