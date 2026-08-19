import { test, expect } from '@playwright/test';

test('has title on login page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('successful login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Fill the username with 'standard_user' and fill the password
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Click the Login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Expects page to have a title with text 'Products'
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
});
