import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
    productNames: Locator;
    productPrices: Locator;

    constructor(private page: Page) {
        this.productNames = this.page.locator('[data-test="inventory-item-name"]');
        this.productPrices = this.page.locator('[data-test="inventory-item-price"]');
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
}