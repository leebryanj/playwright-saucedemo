import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
    // Login with to Product Page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Clicking link opens an empty Cart', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();

        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');

        // No items should be in the cart
        await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    });

    test('User can add an item to Cart', async ({ page }) => {
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

    test('Item in Cart matches product page description and price', async ({ page }) => {
        // Save product details from product page as source of truth
        const sauceLabsBackpack = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });

        const productName = await sauceLabsBackpack.locator('[data-test="inventory-item-name"]').innerText();
        const productDescription = await sauceLabsBackpack.locator('[data-test="inventory-item-desc"]').innerText();
        const productPrice = await sauceLabsBackpack.locator('[data-test="inventory-item-price"]').innerText();

        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Match the earlier sources of truth with descriptions in Cart
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
        await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(productDescription);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(productPrice);
    });

    test('Item can be removed from Cart', async ({ page }) => {
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();

        // Check correct item was added
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

        // Check item is no longer in cart and cart is empty
        await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(0);
    });

    test('Multiple items can be added and one item can be removed from Cart', async ({ page }) => {
        // Add items
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        // Check correct items were added
        await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
        await expect(page.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');

        // Remove an item and check that it has been removed
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="item-4-title-link"]')).not.toBeVisible();
        // Check that the other item is still in Cart
        await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
        await expect(page.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
    });

    test('Cart count updates when multiple item are added to Cart', async ({ page }) => {
        // Cart badge is not rendered when no items in Cart
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

        // Cart icon should show 1 with 1 item added
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Cart icon should show 2 with 2 items added
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    test('Cart count updates when items are removed from Cart', async ({ page }) => {
        // Add 3 items to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

        // Check the current badge count is 3
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');

        // Remove items one at a time and check the current badge count
        await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
        await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });
});