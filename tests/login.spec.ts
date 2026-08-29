import { test, expect } from '@playwright/test';
import { login } from '../helpers/test-helpers';

test.describe('Login', () => {

  // Start at the login page
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('has title on login page', async ({ page }) => {
    // Expect title to have Swag Labs substring
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('successful login with standard user', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    // Expects page to have updated URL and title with text 'Products'
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('login fails with correct username and incorrect password', async ({ page }) => {
    await login(page, 'standard_user', 'abc123');

    // Both username and password fields display an error svg
    const errorSVGs = page.locator('svg[data-icon="circle-xmark"]');
    await expect(errorSVGs).toHaveCount(2);
    await expect(errorSVGs.nth(0)).toBeVisible();
    await expect(errorSVGs.nth(1)).toBeVisible();

    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  });

  test('login fails with invalid username and correct password', async ({ page }) => {
    await login(page, 'not_a_user', 'secret_sauce');

    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  });

  test('login fails with locked out user', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');

    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
  });

  test('login fails with empty username', async ({ page }) => {
    await login(page, '', 'secret_sauce');

    // Username input field is still empty
    await expect(page.getByPlaceholder('Username')).toHaveValue('');
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('login fails with empty password', async ({ page }) => {
    await login(page, 'standard_user', '');

    await expect(page.getByPlaceholder('Password')).toHaveValue('');
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();
  });

  test('clicking "x" on error message toast removes error state', async ({ page }) => {
    await login(page, 'standard_user', '');

    // Check that error toast is present
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();

    await page.locator('[data-test="error-button"]').click();

    await expect(page.getByText('Epic sadface: Password is required')).not.toBeVisible();
  });
});

