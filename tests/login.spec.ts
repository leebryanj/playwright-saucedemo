import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { login } from '../helpers/test-helpers';

test.describe('Login', () => {

  test('has title on login page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('successful login with standard user', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/inventory/);
    await expect(loggedInPage.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('login fails with correct username and incorrect password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'standard_user', 'abc123');

    // Both username and password fields display an error svg
    const errorSVGs = page.locator('svg[data-icon="circle-xmark"]');
    await expect(errorSVGs).toHaveCount(2);
    await expect(errorSVGs.nth(0)).toBeVisible();
    await expect(errorSVGs.nth(1)).toBeVisible();

    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  });

  test('login fails with invalid username and correct password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'not_a_user', 'secret_sauce');

    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  });

  test('login fails with locked out user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'locked_out_user', 'secret_sauce');

    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
  });

  test('login fails with empty username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, '', 'secret_sauce');

    // Username input field is still empty
    await expect(page.getByPlaceholder('Username')).toHaveValue('');
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('login fails with empty password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'standard_user', '');

    await expect(page.getByPlaceholder('Password')).toHaveValue('');
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();
  });

  test('clicking "x" on error message toast removes error state', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'standard_user', '');

    // Check that error toast is present
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();

    await page.locator('[data-test="error-button"]').click();

    await expect(page.getByText('Epic sadface: Password is required')).not.toBeVisible();
  });
});

