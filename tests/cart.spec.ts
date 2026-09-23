import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { CartPage } from '../pages/cart-page';
import { ProductsPage } from '../pages/products-page';

test.describe('Cart', () => {

    test('Clicking link opens an empty Cart', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        await cartPage.openCart();
        await expect(loggedInPage).toHaveURL(/cart\.html/);

        await expect(loggedInPage.locator('[data-test="title"]')).toHaveText('Your Cart');

        // No items should be in the cart
        await expect(cartPage.inventoryItems).toHaveCount(0);
    });

    test('User can add an item to Cart', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        await productsPage.addBackpackToCart();

        // Cart icon should show 1 item in cart
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Add to cart button should now show Remove
        await expect(loggedInPage.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');

        await cartPage.openCart();
        await expect(loggedInPage).toHaveURL(/cart\.html/);

        // Check the correct item was added to the cart
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    });

    test('Item in Cart matches product page description and price', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        // Save product details from product page as source of truth
        const sauceLabsBackpack = loggedInPage
            .locator('[data-test="inventory-item"]')
            .filter({ hasText: 'Sauce Labs Backpack' });

        const productName = await sauceLabsBackpack.locator('[data-test="inventory-item-name"]').innerText();
        const productDescription = await sauceLabsBackpack.locator('[data-test="inventory-item-desc"]').innerText();
        const productPrice = await sauceLabsBackpack.locator('[data-test="inventory-item-price"]').innerText();

        await productsPage.addBackpackToCart();

        await cartPage.openCart();
        await expect(loggedInPage).toHaveURL(/cart\.html/);

        // Match the earlier sources of truth with descriptions in Cart
        const cartProductName = cartPage.productNames.filter({
            hasText: productName
        });

        const cartProductDescription = cartPage.productDescriptions.filter({
            hasText: productDescription
        });

        const cartProductPrice = cartPage.productPrices.filter({
            hasText: productPrice
        });

        await expect(cartProductName).toHaveText(productName);
        await expect(cartProductDescription).toHaveText(productDescription);
        await expect(cartProductPrice).toHaveText(productPrice);
    });

    test('Item can be removed from Cart', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        await productsPage.addBackpackToCart();
        await cartPage.openCart();
        await expect(loggedInPage).toHaveURL(/cart\.html/);

        // Check correct item was added
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

        await cartPage.removeBackpack();

        // Check item is no longer in cart and cart is empty
        await expect(cartPage.inventoryItems).toHaveCount(0);
    });

    test('Multiple items can be added and one item can be removed from Cart', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        // Add items
        await productsPage.addBackpackToCart();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        await cartPage.openCart();
        await expect(loggedInPage).toHaveURL(/cart\.html/);

        // Check correct items were added
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');

        // Remove an item and check that it has been removed
        await cartPage.removeBackpack();
        await expect(loggedInPage.locator('[data-test="item-4-title-link"]')).not.toBeVisible();
        // Check that the other item is still in Cart
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]')).toBeVisible();
        await expect(loggedInPage.locator('[data-test="item-0-title-link"]').locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Bike Light');
    });

    test('Cart count updates when multiple item are added to Cart', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        // Cart badge is not rendered when no items in Cart
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

        // Cart icon should show 1 with 1 item added
        await productsPage.addBackpackToCart();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

        // Cart icon should show 2 with 2 items added
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    });

    test('Cart badge updates when items are removed on the Products page', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        // Add 3 items to the cart
        await productsPage.addBackpackToCart();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await loggedInPage.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

        // Check the current badge count is 3
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');

        // Remove items one at a time and check the current badge count
        await loggedInPage.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
        await loggedInPage.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await productsPage.removeBackpack()
        await expect(loggedInPage.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    });
});