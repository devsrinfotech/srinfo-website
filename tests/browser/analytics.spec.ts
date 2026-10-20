import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('production HTML stays silent on local and unrelated preview hosts', async ({ page }) => {
  const html = await readFile('dist/index.html', 'utf8');
  const googleRequests: string[] = [];
  // Fulfil every request locally. This test never contacts production or Google.
  await page.route('**/*', async route => {
    if (route.request().isNavigationRequest()) {
      await route.fulfill({ status: 200, contentType: 'text/html', body: html });
    } else {
      if (route.request().url().includes('google')) googleRequests.push(route.request().url());
      await route.abort();
    }
  });
  for (const url of ['http://127.0.0.1:4323/', 'https://preview.example.invalid/', 'https://srinfotech.biz.example.invalid/']) {
    await page.goto(url);
    expect(await page.evaluate(() => typeof (window as any).gtag)).toBe('undefined');
  }
  expect(googleRequests).toEqual([]);
});

test('production hosts initialise the original GA4 stream once without sending test data', async ({ page }) => {
  const html = await readFile('dist/contact/index.html', 'utf8');
  const tagRequests: string[] = [];
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (route.request().isNavigationRequest()) {
      await route.fulfill({ status: 200, contentType: 'text/html', body: html });
    } else if (url.startsWith('https://www.googletagmanager.com/gtag/js?')) {
      tagRequests.push(url);
      // A no-op stub: the real Google script is never downloaded or executed.
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* mocked Google tag */' });
    } else {
      await route.abort();
    }
  });
  for (const hostname of ['srinfotech.biz', 'www.srinfotech.biz']) {
    await page.goto(`https://${hostname}/contact/?utm_source=partner&utm_medium=referral&cl=Header&email=private%40example.invalid#details`);
    const events = await page.evaluate(() => (window as any).dataLayer.map((entry: IArguments) => Array.from(entry)));
    const configurations = events.filter((event: unknown[]) => event[0] === 'config');
    expect(configurations).toHaveLength(1);
    expect(configurations[0][1]).toBe('G-MVWQDQYKX9');
    expect(configurations[0][2]).toMatchObject({
      page_location: `https://${hostname}/contact/?utm_source=partner&utm_medium=referral`,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    expect(JSON.stringify(events)).not.toContain('private@example.invalid');
    expect(events.some((event: unknown[]) => event[0] === 'event' && event[1] === 'generate_lead')).toBe(false);
  }
  expect(tagRequests).toEqual([
    'https://www.googletagmanager.com/gtag/js?id=G-MVWQDQYKX9',
    'https://www.googletagmanager.com/gtag/js?id=G-MVWQDQYKX9',
  ]);
});
