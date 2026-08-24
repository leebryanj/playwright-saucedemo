import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
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

    test('All correct product prices are dispalyed', async ({ page }) => {
        const productPrices = page.locator('[data-test="inventory-item-price"]');

        await expect(productPrices).toHaveText([
            '$29.99',
            '$9.99',
            '$15.99',
            '$49.99',
            '$7.99',
            '$15.99'
        ]);
    });

    test('Products can be sorted from A to Z', async ({ page }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption('az');

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

    test('Products can be sorted from Z to A', async ({ page }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption('za');

        const productNames = page.locator('[data-test="inventory-item-name"]');

        await expect(productNames).toHaveText([
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack'
        ]);
    });

    test('Products can be sorted by price from low to hi', async ({ page }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

        const productNames = page.locator('[data-test="inventory-item-name"]');

        await expect(productNames).toHaveText([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket'
        ]);
    });

    test('Products can be sorted by price from hi to low', async ({ page }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

        const productNames = page.locator('[data-test="inventory-item-name"]');

        await expect(productNames).toHaveText([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie'
        ]);
    });
});