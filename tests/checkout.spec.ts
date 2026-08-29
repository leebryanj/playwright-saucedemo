import { test, expect } from '@playwright/test';
import { login } from '../helpers/test-helpers';
import { completeCheckoutInformation } from '../helpers/test-helpers';

test.describe('Checkout', () => {
    // Login with to Product Page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await login(page, 'standard_user', 'secret_sauce');
    });

    test('Checkout with no items shows correct $0.00 totals', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();

        await completeCheckoutInformation(page);

        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $0.00');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00');
    });

    test('Checkout with single item shows correct total', async ({ page }) => {
        // Add 1 item to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        await completeCheckoutInformation(page);

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

        await completeCheckoutInformation(page);

        // Tax rate is flat 8% regardless of user information
        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');
    });

    test('Checkout with three items shows correct total', async ({ page }) => {
        // Add 3 items to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

        await page.locator('[data-test="shopping-cart-link"]').click();

        await completeCheckoutInformation(page);

        // Tax rate is flat 8% regardless of user information
        await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $55.97');
        await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $4.48');
        await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $60.45');
    });

    test('Leaving all fields blank shows correct error', async ({ page }) => {
        // Reach the Checkout Your Information page
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        // Leave all fields blank and click continue button
        await page.locator('[data-test="continue"]').click();

        // Shows the error message
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    });

    test('Leaving first name field blank shows correct error', async ({ page }) => {
        // Reach the Checkout Your Information page
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        // Fill in fields except First Name and click continue button
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        // Shows the error message for first name left blank
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    });

    test('Leaving last name field blank shows correct error', async ({ page }) => {
        // Reach the Checkout Your Information page
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        // Fill in fields except Last Name and click continue button
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
        await page.locator('[data-test="continue"]').click();

        // Shows the error message for last name left blank
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
    });

    test('Leaving zip/postal code field blank shows correct error', async ({ page }) => {
        // Reach the Checkout Your Information page
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        // Fill in fields except Last Name and click continue button
        await page.locator('[data-test="firstName"]').fill('Test');
        await page.locator('[data-test="lastName"]').fill('User');
        await page.locator('[data-test="continue"]').click();

        // Shows the error message for postal code left blank
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    });

    test('Clicking cancel in Your Information page takes user back to Cart page', async ({ page }) => {
        // Reach the Checkout Your Information page
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        // Click the cancel button
        await page.locator('[data-test="cancel"]').click();

        // Check that we are back to the Your Cart page
        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    });

    test('Clicking cancel in Checkout Overview page takes user back to Product page', async ({ page }) => {
        // Add that item to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // Reach Checkout and click Cancel
        await page.locator('[data-test="shopping-cart-link"]').click();
        await completeCheckoutInformation(page);
        await page.locator('[data-test="cancel"]').click();

        // Check that we are back to the Products page
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('Checkout displays product information matching Product page', async ({ page }) => {
        // Add an item to Cart and save product information
        const sauceLabsBackpack = page.locator('[data-test="inventory-item"]').filter({ hasText: 'Sauce Labs Backpack' });
        const productName = await sauceLabsBackpack.locator('[data-test="inventory-item-name"]').innerText();
        const productDescription = await sauceLabsBackpack.locator('[data-test="inventory-item-desc"]').innerText();
        const productPrice = await sauceLabsBackpack.locator('[data-test="inventory-item-price"]').innerText();

        // Add that item to cart
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // Reach Checkout
        await page.locator('[data-test="shopping-cart-link"]').click();
        await completeCheckoutInformation(page);

        // Confirm Checkout item details matches the Product page details
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
        await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(productDescription);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(productPrice);
    });

    test('User can checkout successfully and complete an order', async ({ page }) => {
        // Add item to cart and go to Cart page
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();

        // Fill in user information and continue to Checkout Page
        await completeCheckoutInformation(page);

        // Finish checkout
        await page.locator('[data-test="finish"]').click();

        await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
        await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
        await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
    });
});