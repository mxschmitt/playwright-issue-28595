import { test, expect } from '@playwright/test';

test('This is a test ', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/'); // target test url
  
  await page.evaluate(() => document.addEventListener('click', e => console.log('click', e.target, e.composedPath())));
  await page.locator('#btnTest').waitFor();
  console.log('ready to click');
  await page.locator('#btnTest').click();
  await expect(page.locator('#title')).toContainText('playwright bug');
});