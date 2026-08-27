import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
    // Login with to Product Page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Checkout with no items shows correct $0.00 totals', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();

        // Fill in user information
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $0.00');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00');
    });

    test('Checkout with single item shows correct total', async ({ page }) => {
        // Add 1 item to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Fill in user information
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        // Tax rate is flat 8% regardless of user information
        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');
    });

    test('Checkout with two items shows correct total', async ({ page }) => {
        // Add 2 items to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Fill in user information
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        // Tax rate is flat 8% regardless of user information
        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');
    });

    test('Checkout with multiple items shows correct total', async ({ page }) => {
        // Add 3 items to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Fill in user information
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        // Tax rate is flat 8% regardless of user information
        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $55.97');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $4.48');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $60.45');
    });

    test('Leaving all fields blank shows correct error', async ({ page }) => {

    });

    test('Leaving first name field blank shows correct error', async ({ page }) => {

    });

    test('Leaving last name field blank shows correct error', async ({ page }) => {

    });

    test('Leaving zip/postal code field blank shows correct error', async ({ page }) => {

    });

    test('Clicking cancel in checkout takes user back to Product page', async ({ page }) => {

    });

    test('Checkout page shows correct item list', async ({ page }) => {

    });
});