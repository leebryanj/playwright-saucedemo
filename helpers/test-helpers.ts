import { type Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
}

export async function completeCheckoutInformation(page: Page) {
    // navigate to checkout
    await page.locator('[data-test="checkout"]').click();
    // fill in fields
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('A1A 1A1');
    // complete checkout and continue
    await page.locator('[data-test="continue"]').click();
}