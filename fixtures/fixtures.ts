// import test as base because we will extent that test with our own fixture
import { test as base, type Page } from '@playwright/test';
import { login } from '../helpers/test-helpers';

type MyFixtures = {
    loggedInPage: Page;
}

export const test = base.extend<MyFixtures>({
    loggedInPage: async ({ page }, use) => {
        await page.goto('https://www.saucedemo.com/');
        await login(page, 'standard_user', 'secret_sauce');

        await use(page);
    },
});