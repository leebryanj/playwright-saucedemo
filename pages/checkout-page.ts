import { type Locator, type Page } from "@playwright/test";

export class CheckoutPage {
    firstName: Locator;
    lastName: Locator;
    postalCode: Locator;
    subtotalLabel: Locator;
    taxLabel: Locator;
    totalLabel: Locator;
    errorMessage: Locator;
    productNames: Locator;
    productDescriptions: Locator;
    productPrices: Locator;
    title: Locator;
    completeHeader: Locator;
    ponyExpressImage: Locator;

    constructor(private page: Page) {
        this.firstName = this.page.locator('[data-test="firstName"]');
        this.lastName = this.page.locator('[data-test="lastName"]');
        this.postalCode = this.page.locator('[data-test="postalCode"]');
        this.subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
        this.taxLabel = this.page.locator('[data-test="tax-label"]');
        this.totalLabel = this.page.locator('[data-test="total-label"]');
        this.errorMessage = this.page.locator('[data-test="error"]');
        this.productNames = this.page.locator('[data-test="inventory-item-name"]');
        this.productDescriptions = this.page.locator('[data-test="inventory-item-desc"]');
        this.productPrices = this.page.locator('[data-test="inventory-item-price"]');
        this.title = this.page.locator('[data-test="title"]');
        this.completeHeader = this.page.locator('[data-test="complete-header"]');
        this.ponyExpressImage = this.page.locator('[data-test="pony-express"]');
    }

    async completeCheckoutInformation(
        firstName: string,
        lastName: string,
        postalCode: string
    ) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async continueToOverview() {
        await this.page.locator('[data-test="continue"]').click();
    }

    async finishCheckout() {
        await this.page.locator('[data-test="finish"]').click();
    }

    async cancelCheckout() {
        await this.page.locator('[data-test="cancel"]').click();
    }
}