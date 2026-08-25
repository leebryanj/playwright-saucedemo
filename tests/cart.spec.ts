import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
    // Login with to Product Page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Clicking cart link goes to empty cart', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();

        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');

        // No items should be in the cart
        await expect(page.locator('[data-test="inventory-item"]')).not.toBeVisible();
    });

    test('Can add an item to cart', async ({ page }) => {
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // Cart icon should show 1 item in cart
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Add to cart button should now show Remove
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Check the correct item was added to the cart
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    });

    test('Item can be removed from Cart', async ({ page }) => {
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();

        // Check correct item was added
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

        // Check item is no longer in cart and cart is empty
        await expect(page.locator('[data-test="inventory-item"]')).not.toBeVisible();

    })
});