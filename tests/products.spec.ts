import { test, expect } from '@playwright/test';

test.describe('Standard User Product Page', () => {
    // Login with to Product Page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Products title appears on page', async ({ page }) => {
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('Shopping cart link appears on page', async ({ page }) => {
        await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    test('Sorting dropdown appears on page', async ({ page }) => {
        await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
    });

    test('Inventory list appears on page', async ({ page }) => {
        await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
    });

    test('Product page should display all six inventory items', async ({ page }) => {
        // SauceDemo has a permanent fixed list of 6 items
        await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
    });

    test('All correct product names are displayed', async ({ page }) => {
        const productNames = page.locator('[data-test="inventory-item-name"]');

        await expect(productNames).toHaveText([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ]);
    });
});