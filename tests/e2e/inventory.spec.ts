import { test, expect } from '@fixtures/pages';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('sorts products by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by price, high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorts products by name, Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });
});
