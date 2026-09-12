import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout-page';
import { CartPage } from '../pages/cart-page';
import { ProductsPage } from '../pages/products-page';

test.describe('Checkout', () => {

    test('Checkout with no items shows correct $0.00 totals', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $0');
        await expect(checkoutPage.taxLabel).toHaveText('Tax: $0.00');
        await expect(checkoutPage.totalLabel).toHaveText('Total: $0.00');
    });

    test('Checkout with single item shows correct total', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);

        // Add 1 item to cart
        await productsPage.addBackpackToCart();

        await cartPage.openCart();

        await cartPage.startCheckout();
        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        // Tax rate is flat 8% regardless of user information
        await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $29.99');
        await expect(checkoutPage.taxLabel).toHaveText('Tax: $2.40');
        await expect(checkoutPage.totalLabel).toHaveText('Total: $32.39');
    });

    test('Checkout with two items shows correct total', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        // Add 2 items to cart
        await productsPage.addBackpackToCart();
        await productsPage.addBikeLightToCart();

        await cartPage.openCart();

        await cartPage.startCheckout();
        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        // Tax rate is flat 8% regardless of user information
        await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $39.98');
        await expect(checkoutPage.taxLabel).toHaveText('Tax: $3.20');
        await expect(checkoutPage.totalLabel).toHaveText('Total: $43.18');
    });

    test('Checkout with three items shows correct total', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);
        // Add 3 items to cart
        await productsPage.addBackpackToCart();
        await productsPage.addBikeLightToCart();
        await productsPage.addBoltTShirtToCart();

        await cartPage.openCart();

        await cartPage.startCheckout();
        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        // Tax rate is flat 8% regardless of user information
        await expect(checkoutPage.subtotalLabel).toHaveText('Item total: $55.97');
        await expect(checkoutPage.taxLabel).toHaveText('Tax: $4.48');
        await expect(checkoutPage.totalLabel).toHaveText('Total: $60.45');
    });

    test('Leaving all fields blank shows correct error', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        // Leave all fields blank and click continue button
        await checkoutPage.continueToOverview();

        // Shows the error message
        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: First Name is required');
    });

    test('Leaving first name field blank shows correct error', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        // Fill in fields except First Name and click continue button
        await checkoutPage.lastName.fill('User');
        await checkoutPage.postalCode.fill('A1A 1A1');
        await checkoutPage.continueToOverview();

        await expect(checkoutPage.errorMessage)
            .toHaveText('Error: First Name is required');
    });

    test('Leaving last name field blank shows correct error', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        // Fill in fields except Last Name and click continue button
        await checkoutPage.firstName.fill('Test');
        await checkoutPage.postalCode.fill('A1A 1A1');
        await checkoutPage.continueToOverview();

        // Shows the error message for last name left blank
        await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
    });

    test('Leaving zip/postal code field blank shows correct error', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        await checkoutPage.firstName.fill('Test');
        await checkoutPage.lastName.fill('User');
        await checkoutPage.continueToOverview();

        // Shows the error message for postal code left blank
        await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
    });

    test('Clicking cancel in Your Information page takes user back to Cart page', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await cartPage.openCart();
        await cartPage.startCheckout();

        // Cancel checkout
        await checkoutPage.cancelCheckout();

        // Check that user returned to Cart
        await expect(cartPage.title).toHaveText('Your Cart');
    });

    test('Clicking cancel in Checkout Overview page takes user back to Product page', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);

        await productsPage.addBackpackToCart();

        await cartPage.openCart();
        await cartPage.startCheckout();
        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();
        await checkoutPage.cancelCheckout();

        // Check that we are back to the Products page
        await expect(productsPage.title).toHaveText('Products');
    });

    test('Checkout displays product information matching Product page', async ({ loggedInPage }) => {
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);
        const productsPage = new ProductsPage(loggedInPage);

        // Save product information from Product page
        const sauceLabsBackpack = productsPage.inventoryItems.filter({
            hasText: 'Sauce Labs Backpack'
        });

        const productName = await sauceLabsBackpack.locator('[data-test="inventory-item-name"]').innerText();
        const productDescription = await sauceLabsBackpack.locator('[data-test="inventory-item-desc"]').innerText();
        const productPrice = await sauceLabsBackpack.locator('[data-test="inventory-item-price"]').innerText();

        await productsPage.addBackpackToCart();
        await cartPage.openCart();
        await cartPage.startCheckout();

        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        // Confirm Checkout details match Product page details
        await expect(checkoutPage.productNames).toHaveText(productName);
        await expect(checkoutPage.productDescriptions).toHaveText(productDescription);
        await expect(checkoutPage.productPrices).toHaveText(productPrice);
    });

    test('User can checkout successfully and complete an order', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        const cartPage = new CartPage(loggedInPage);
        const checkoutPage = new CheckoutPage(loggedInPage);

        await productsPage.addBackpackToCart();
        await cartPage.openCart();
        await cartPage.startCheckout();

        await checkoutPage.completeCheckoutInformation('Test', 'User', 'A1A 1A1');
        await checkoutPage.continueToOverview();

        await checkoutPage.finishCheckout();

        // Verify order completion
        await expect(checkoutPage.title).toHaveText('Checkout: Complete!');
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        await expect(checkoutPage.ponyExpressImage).toBeVisible();
    });
});