import { type Locator, type Page } from "@playwright/test";

export class CartPage {
    productNames: Locator;
    productDescriptions: Locator;
    productPrices: Locator;
    inventoryItems: Locator;

    constructor(private page: Page) {
        this.productNames = this.page.locator('[data-test="inventory-item-name"]');
        this.productDescriptions = this.page.locator('[data-test="inventory-item-desc"]');
        this.productPrices = this.page.locator('[data-test="inventory-item-price"]');
        this.inventoryItems = this.page.locator('[data-test="inventory-item"]');
    }

    async removeBackpack() {
        await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    }

    async openCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }
}