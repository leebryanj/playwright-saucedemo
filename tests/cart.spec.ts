import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Cart', () => {

    test('Clicking link opens an empty Cart', async ({ loggedInPage }) => {
        await loggedInPage.locator('[data-test="shopping-cart-link"]').click();

        await expect(loggedInPage.locator('[data-test="title"]')).toHaveText('Your Cart');

        // No items should be in the cart
        await expect(loggedInPage.locator('[data-test="inventory-item"]')).toHaveCount(0);
    });

    test('User can add an item to Cart', async ({ loggedInPage }) => {
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // Cart icon should show 1 item in cart
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Add to cart button should now show Remove
        await expect(loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');

        await loggedInPage.locator('[data-test="shopping-cart-link"]').click();

        // Check the correct item was added to the cart
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    });

    test('Item in Cart matches product page description and price', async ({ loggedInPage }) => {
        // Save product details from product page as source of truth
        const sauceLabsBackpack = loggedInPage.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });

        const productName = await sauceLabsBackpack.locator('[data-test="inventory-item-name"]').innerText();
        const productDescription = await sauceLabsBackpack.locator('[data-test="inventory-item-desc"]').innerText();
        const productPrice = await sauceLabsBackpack.locator('[data-test="inventory-item-price"]').innerText();

        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        await loggedInPage.locator('[data-test="shopping-cart-link"]').click();

        // Match the earlier sources of truth with descriptions in Cart
        await expect(loggedInPage.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
        await expect(loggedInPage.locator('[data-test="inventory-item-desc"]')).toHaveText(productDescription);
        await expect(loggedInPage.locator('[data-test="inventory-item-price"]')).toHaveText(productPrice);
    });

    test('Item can be removed from Cart', async ({ loggedInPage }) => {
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await loggedInPage.locator('[data-test="shopping-cart-link"]').click();

        // Check correct item was added
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

        await loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]').click();

        // Check item is no longer in cart and cart is empty
        await expect(loggedInPage.locator('[data-test="inventory-item"]')).toHaveCount(0);
    });

    test('Multiple items can be added and one item can be removed from Cart', async ({ loggedInPage }) => {
        // Add items
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        await loggedInPage.locator('[data-test="shopping-cart-link"]').click();

        // Check correct items were added
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');

        // Remove an item and check that it has been removed
        await loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).not.toBeVisible();
        // Check that the other item is still in Cart
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
    });

    test('Cart count updates when multiple item are added to Cart', async ({ loggedInPage }) => {
        // Cart badge is not rendered when no items in Cart
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

        // Cart icon should show 1 with 1 item added
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Cart icon should show 2 with 2 items added
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    test('Cart count updates when items are removed from Cart', async ({ loggedInPage }) => {
        // Add 3 items to the cart
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

        // Check the current badge count is 3
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');

        // Remove items one at a time and check the current badge count
        await loggedInPage.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
        await loggedInPage.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });
});