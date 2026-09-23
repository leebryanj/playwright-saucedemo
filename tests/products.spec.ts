import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { ProductsPage } from '../pages/products-page';

test.describe('Product Page', () => {
    test('Products title appears on page', async ({ loggedInPage }) => {
        await expect(loggedInPage.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('Shopping cart link appears on page', async ({ loggedInPage }) => {
        await expect(loggedInPage.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    });

    test('Sorting dropdown appears on page', async ({ loggedInPage }) => {
        await expect(loggedInPage.locator('[data-test="product-sort-container"]')).toBeVisible();
    });

    test('Inventory list appears on page', async ({ loggedInPage }) => {
        await expect(loggedInPage.locator('[data-test="inventory-list"]')).toBeVisible();
    });

    test('Product page should display all six inventory items', async ({ loggedInPage }) => {
        // SauceDemo has a permanent fixed list of 6 items
        await expect(loggedInPage.locator('[data-test="inventory-item"]')).toHaveCount(6);
    });

    test('All correct product names are displayed', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);

        await expect(productsPage.productNames).toHaveText([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ]);
    });

    test('All correct product prices are dispalyed', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);

        await expect(productsPage.productPrices).toHaveText([
            '$29.99',
            '$9.99',
            '$15.99',
            '$49.99',
            '$7.99',
            '$15.99'
        ]);
    });

    test('Products can be sorted from A to Z', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        // Sort from Z to A first to ensure the sort is working
        await productsPage.sortByNameZA();
        await expect(productsPage.productNames).toHaveText([
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack'
        ]);
        // Now sort from A to Z to check the order
        await productsPage.sortByNameAZ();
        await expect(productsPage.productNames).toHaveText([
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ]);
    });

    test('Products can be sorted from Z to A', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        await productsPage.sortByNameZA();

        await expect(productsPage.productNames).toHaveText([
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack'
        ]);
    });

    test('Products can be sorted by price from low to hi', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        await productsPage.sortByPriceLoHi();

        await expect(productsPage.productNames).toHaveText([
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket'
        ]);
    });

    test('Products can be sorted by price from hi to low', async ({ loggedInPage }) => {
        const productsPage = new ProductsPage(loggedInPage);
        await productsPage.sortByPriceHiLo();

        await expect(productsPage.productNames).toHaveText([
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie'
        ]);
    });
});