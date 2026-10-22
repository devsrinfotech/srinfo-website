import { test, expect } from '@playwright/test';

test('buying pages and articles are readable and connected without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ['/', '/categories/electronics/', '/categories/footwear/', '/ecommerce-returns/', '/insights/prepare-surplus-stock-list/', '/insights/how-to-prepare-a-footwear-stocklot-for-a-bulk-buyer/']) {
    const response = await page.goto(`${baseURL}${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main')).toContainText(/SR Infotech/i);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://srinfotech.biz${path}`);
    await expect(page.locator('main a[href^="/insights/"]').first()).toBeAttached();
  }
  await context.close();
});

test('query variants canonicalise and retired/private URLs return 404', async ({ request }) => {
  const contact = await request.get('/contact/?utm_source=qa&cl=Header');
  expect(contact.status()).toBe(200);
  expect(await contact.text()).toContain('rel="canonical" href="https://srinfotech.biz/contact/"');
  for (const path of ['/search-engine-optimization.html', '/local-context/README.md', '/old%20business%20website%20data/index.html', '/missing-inventory-page/']) {
    const response = await request.get(path);
    expect(response.status(),path).toBe(404);
    expect(await response.text()).toContain('noindex, follow');
  }
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('https://srinfotech.biz/sitemap-0.xml');
});
