import { test, expect } from '@fixtures/pages';
import { products } from '@data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding products updates the cart badge', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.header.cartBadge).toBeHidden();

    await inventoryPage.addToCart(products.backpack.name);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');

    await inventoryPage.addToCart(products.bikeLight.name);
    await expect(inventoryPage.header.cartBadge).toHaveText('2');
  });

  test('added products appear in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.onesie.name);
    await inventoryPage.header.openCart();

    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.onesie.name]);
  });

  test('removing a product from the inventory page updates the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.removeFromCart(products.backpack.name);

    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });

  test('removing the last product from the cart page empties it', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.fleeceJacket.name);
    await inventoryPage.header.openCart();
    await cartPage.removeItem(products.fleeceJacket.name);

    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.header.cartBadge).toBeHidden();
  });

  test('cart content survives a page reload', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCart(products.boltTShirt.name);
    await inventoryPage.header.openCart();
    await page.reload();

    await expect(cartPage.itemNames).toHaveText([products.boltTShirt.name]);
  });
});
