import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

test('all key pages fit mobile and desktop without console errors or serious accessibility issues', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await mkdir('artifacts', {recursive:true});
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:width===1440?1000:844});
    await page.goto('/');
    await page.evaluate(()=>document.fonts.ready);
    for(const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(()=>img.evaluate((el: HTMLImageElement)=>el.naturalWidth)).toBeGreaterThan(0);
    }
    await page.mouse.wheel(0,-10000);
    await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:true});
    await page.screenshot({path:`artifacts/home-top-${width}.png`});
  }
  const routes = ['/', '/categories/apparel/', '/categories/home-kitchen/', '/categories/electronics/', '/contact/', '/insights/', '/insights/prepare-surplus-stock-list/', '/how-it-works/', '/about/'];
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({width,height:950});
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('main h1')).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow, `${route} overflows at ${width}px`).toBe(false);
    }
  }
  for (const route of ['/', '/contact/', '/insights/', '/insights/prepare-surplus-stock-list/']) {
    await page.goto(route);
    const { violations } = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(violations.map(v => `${v.id}: ${v.nodes.map(n=>n.target).join('; ')}`),route).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('mobile navigation, FAQ, search and empty-state reset work', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const toggle=page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Insights',exact:true}).click();
  await expect(page).toHaveURL(/\/insights\/$/);
  await page.getByRole('button',{name:'Electronics',exact:true}).click();
  await expect(page.locator('.article-card:visible')).toHaveCount(1);
  await page.getByRole('searchbox',{name:'Search insights'}).fill('no-match-stock-123');
  await expect(page.locator('#no-results')).toBeVisible();
  await page.getByRole('button',{name:'Show all insights'}).click();
  await expect(page.locator('.article-card:visible')).toHaveCount(4);
  await page.goto('/');
  await page.getByText('Do you arrange pickup across India?',{exact:true}).click();
  await expect(page.locator('details[open]')).toContainText('own logistics');
});

test('form validates, preserves legacy payload and handles an opaque response without claiming success', async ({page}) => {
  let requestBody='';
  let calls=0;
  await page.route('https://mycrm.srinfotech.biz/**',async route=>{
    calls++;
    requestBody=route.request().postData() || '';
    await new Promise(resolve=>setTimeout(resolve,200));
    await route.fulfill({status:200,body:'{"message":"ok"}'});
  });
  await page.goto('/contact/?category=electronics&cl=QA');
  await expect(page.locator('#service')).toHaveValue('Electronics liquidation');
  await page.getByRole('button',{name:'Discuss my inventory'}).click();
  expect(calls).toBe(0);
  await page.getByLabel('Your name').fill('QA Supplier');
  await page.getByLabel('Company name').fill('Example QA');
  await page.getByLabel('Work email').fill('qa@example.invalid');
  await page.getByLabel('Phone number').fill('invalidphone');
  expect(await page.getByLabel('Phone number').evaluate((input: HTMLInputElement)=>input.checkValidity())).toBe(false);
  await page.getByLabel('Phone number').fill('+91 9999999999');
  await page.getByLabel('Stock location').fill('Bengaluru');
  await page.getByLabel('I agree to be contacted').check();
  await page.getByRole('button',{name:'Discuss my inventory'}).click();
  await expect(page.locator('#submit-enquiry')).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('delivery has not been confirmed');
  expect(calls).toBe(1);
  for(const field of ['name','email_id','mobile_number','organization','company_website','service','message','click_location']) expect(requestBody).toContain(`name="${field}"`);
  expect(requestBody).toContain('Stock location: Bengaluru');
  await expect(page.getByLabel('Your name')).toHaveValue('QA Supplier');
  await page.unroute('https://mycrm.srinfotech.biz/**');
  await page.route('https://mycrm.srinfotech.biz/**',route=>route.abort('failed'));
  await page.getByRole('button',{name:'Discuss my inventory'}).click();
  await expect(page.getByRole('status')).toContainText('couldn’t confirm delivery');
});

test('legacy contact URL carries attribution into the new form', async ({page})=>{
  await page.goto('/contact.html?cl=Legacy');
  await expect(page).toHaveURL(/\/contact\/\?cl=Legacy$/);
});
