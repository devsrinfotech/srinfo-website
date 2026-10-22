import { test, expect } from '@playwright/test';
import { mockTurnstile } from './turnstile-mock';

test('footwear is discoverable and its enquiry keeps category and pair quantities', async ({ page }) => {
  await mockTurnstile(page);
  let submitted = '';
  await page.route('https://mycrm.srinfotech.biz/**', async route => {
    submitted = route.request().postData() || '';
    await route.fulfill({ status: 201, contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({message:{status:'success',saved:true,lead_id:'FOOTWEAR-QA'}}) });
  });
  await page.goto('/');
  await expect(page.locator('.category-card')).toHaveCount(4);
  await expect(page.locator('footer a[href="/categories/footwear/"]')).toBeVisible();
  await page.locator('.category-card[href="/categories/footwear/"]').click();
  await expect(page).toHaveURL(/\/categories\/footwear\/$/);
  await expect(page).toHaveTitle(/Footwear Surplus Stock Buyers in India/);
  await expect(page.locator('main')).toContainText('matched pairs');
  await expect(page.locator('main')).toContainText('How to prepare a footwear stocklot for a bulk buyer');
  await page.getByRole('link', {name:'Discuss your footwear stock', exact:true}).click();
  await expect(page.locator('#service')).toHaveValue('Footwear liquidation');
  await expect(page.locator('#quantity')).toHaveAttribute('placeholder', /pairs/);
  await page.locator('#service').selectOption('Electronics liquidation');
  await expect(page.locator('#quantity')).toHaveAttribute('placeholder', /units/);
  await page.locator('#service').selectOption('Footwear liquidation');
  await expect(page.locator('#quantity')).toHaveAttribute('placeholder', /pairs/);
  await page.getByLabel('Your name').fill('QA Supplier');
  await page.getByLabel('Company name').fill('Footwear QA');
  await page.getByLabel('Work email').fill('qa@example.invalid');
  await page.getByLabel('Phone number').fill('+91 9999999999');
  await page.getByLabel('Stock location').fill('Bengaluru');
  await page.getByLabel('Approximate quantity').fill('800 pairs / 24 cartons');
  await page.getByLabel('I agree to be contacted').check();
  await page.getByRole('button', {name:'Verify test check', exact:true}).click();
  await page.getByRole('button', {name:'Discuss my inventory', exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Your inventory enquiry has been received');
  expect(submitted).toContain('Footwear liquidation');
  expect(submitted).toContain('Approximate quantity: 800 pairs / 24 cartons');
});
