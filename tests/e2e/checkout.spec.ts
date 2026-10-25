import { test, expect } from '@fixtures/pages';
import { products, TAX_RATE } from '@data/products';
import { customer, checkoutErrors } from '@data/checkout';

test.describe('Checkout', () => {
  const cart = [products.backpack, products.bikeLight];

  // Arrange: every checkout test starts with the same two products in the cart.
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    for (const product of cart) {
      await inventoryPage.addToCart(product.name);
    }
    await inventoryPage.header.openCart();
    await cartPage.checkout();
  });

  test('user can complete a purchase', { tag: '@smoke' }, async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation(customer);
    await expect(checkoutPage.itemNames).toHaveText(cart.map((p) => p.name));

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('overview shows the correct subtotal, tax and total', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(customer);

    const expectedSubtotal = cart.reduce((sum, p) => sum + p.price, 0);
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE * 100) / 100;

    // toBeCloseTo avoids floating point surprises like 0.1 + 0.2 = 0.30000000000000004
    expect(await checkoutPage.getAmount(checkoutPage.subtotalLabel)).toBeCloseTo(expectedSubtotal, 2);
    expect(await checkoutPage.getAmount(checkoutPage.taxLabel)).toBeCloseTo(expectedTax, 2);
    expect(await checkoutPage.getAmount(checkoutPage.totalLabel)).toBeCloseTo(expectedSubtotal + expectedTax, 2);
  });

  test('cart is empty after the order is placed', async ({ checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toBeVisible();
    // The header (and its cart badge) is shared, so any Page Object's header works here.
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test.describe('form validation', () => {
    const cases = [
      { field: 'first name', info: { ...customer, firstName: '' }, error: checkoutErrors.firstNameRequired },
      { field: 'last name', info: { ...customer, lastName: '' }, error: checkoutErrors.lastNameRequired },
      { field: 'postal code', info: { ...customer, postalCode: '' }, error: checkoutErrors.postalCodeRequired },
    ];

    for (const { field, info, error } of cases) {
      test(`requires ${field}`, async ({ checkoutPage, page }) => {
        await checkoutPage.fillInformation(info);

        await expect(checkoutPage.errorMessage).toHaveText(error);
        await expect(page).toHaveURL(/checkout-step-one\.html/);
      });
    }
  });
});
