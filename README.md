# SauceDemo Playwright Test Automation

A QA automation learning and portfolio project using Playwright and TypeScript to test the public SauceDemo demo application, covering workflows from login and product sorting to cart management and checkout.

The suite uses reusable login setup, lightweight Page Object Model classes, and assertions kept in the tests to make scenarios easy to follow.

## Test coverage

The test suite runs across Chromium, Firefox, and WebKit for cross-browser coverage.

| Area | Scenarios covered |
| --- | --- |
| Login | Successful login, invalid credentials, locked-out user, required fields, and error-message dismissal |
| Products | Inventory visibility, product names and prices, and sorting by name and price |
| Cart | Adding and removing items, badge counts, and product details matching the inventory |
| Checkout | Totals for zero through three items, required customer fields, cancellation destinations, product details, and successful order completion |

## Getting started

Use **Node.js 24** and npm.

```bash
git clone https://github.com/leebryanj/playwright-saucedemo.git
cd playwright-saucedemo
```

If you use nvm, run `nvm install` followed by `nvm use` in the project directory. The `.nvmrc` file records the Node major version.

```bash
npm ci
npx playwright install
```

`npm ci` installs dependencies from the committed lockfile, including the project's local TypeScript compiler.

Tests run against the public SauceDemo site and require internet access. No local application server or environment file is needed.

## Running checks and tests

```bash
# Check TypeScript types without generating JavaScript
npm run typecheck

# Run all tests across all three browsers
npx playwright test
```

Type-checking and browser tests are separate checks: the first checks TypeScript correctness, while the second verifies application behavior.

| Task | Command |
| --- | --- |
| Run Chromium only | `npx playwright test --project=chromium` |
| Run the cart tests in Chromium | `npx playwright test tests/cart.spec.ts --project=chromium` |
| Open interactive UI mode | `npx playwright test --ui` |
| Run with a visible browser | `npx playwright test --project=chromium --headed` |
| Record traces for a diagnostic run | `npx playwright test --project=chromium --trace on` |
| Open the latest HTML report | `npx playwright show-report` |

The default reporter writes an HTML report to `playwright-report/`. Test artifacts are excluded from Git. Traces are normally recorded on the first retry; local runs have no retries by default, so use `--trace on` when investigating a local failure.

## Project structure

```text
fixtures/
  fixtures.ts             # Authenticated page fixture
helpers/
  test-helpers.ts          # Reusable login interaction
pages/
  products-page.ts         # Inventory elements and actions
  cart-page.ts             # Cart elements and actions
  checkout-page.ts         # Checkout elements and actions
tests/
  login.spec.ts
  products.spec.ts
  cart.spec.ts
  checkout.spec.ts
playwright.config.ts      # Browser projects and execution settings
tsconfig.json             # Strict TypeScript configuration
.nvmrc                    # Node.js major version
```

## Design decisions

- **Isolated setup:** the `loggedInPage` fixture signs in as `standard_user` using Playwright's test-scoped page. Tests that need to control the login form use the normal `page` fixture.
- **Page-specific interactions:** page objects hold reusable locators and actions. Tests describe scenarios and assert the expected results.
- **Locator choices:** tests primarily use SauceDemo's `data-test` attributes, with role and placeholder locators for login interactions.
- **Explicit expectations:** fixed catalog and total expectations check known values; cross-page comparisons check that product details remain consistent through the shopping workflow.
- **Independent execution:** each test sets up its own state, allowing the suite to run in parallel.

## Scope and assumptions

The suite targets SauceDemo's public demo accounts and fixed product catalog. Expected prices and checkout tax values are encoded in the tests. Changes to the demo or its availability can affect results.

The empty-checkout scenario records the demo's current zero-total behavior; it does not define a business requirement for a production store.
