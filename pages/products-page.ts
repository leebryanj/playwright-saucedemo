import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
    productNames: Locator;
    productPrices: Locator;
    productDescriptions: Locator;
    inventoryItems: Locator;
    title: Locator;

    constructor(private page: Page) {
        this.productNames = this.page.locator('[data-test="inventory-item-name"]');
        this.productPrices = this.page.locator('[data-test="inventory-item-price"]');
        this.productDescriptions = this.page.locator('[data-test="inventory-item-desc"]');
        this.inventoryItems = this.page.locator('[data-test="inventory-item"]');
        this.title = this.page.locator('[data-test="title"]');
    }

    async sortByNameAZ() {
        await this.page.locator('[data-test="product-sort-container"]').selectOption('az');
    }

    async sortByNameZA() {
        await this.page.locator('[data-test="product-sort-container"]').selectOption('za');
    }

    async sortByPriceLoHi() {
        await this.page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    }

    async sortByPriceHiLo() {
        await this.page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    }

    async addBackpackToCart() {
        await this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    }

    async addBikeLightToCart() {
        await this.page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    }

    async addBoltTShirtToCart() {
        await this.page
            .locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')
            .click();
    }

    async removeBackpack() {
        await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    }
}