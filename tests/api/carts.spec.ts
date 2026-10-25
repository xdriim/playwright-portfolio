import { test, expect } from '@fixtures/api';

type CartLine = { id: number; price: number; quantity: number; total: number };

test.describe('Carts API', () => {
  test('POST /carts/add calculates line totals and cart total', async ({ authedRequest }) => {
    const response = await authedRequest.post('/carts/add', {
      data: {
        userId: 1,
        products: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
      },
    });

    expect(response.status()).toBe(201);
    const cart = await response.json();
    expect(cart.totalProducts).toBe(2);
    expect(cart.totalQuantity).toBe(3);

    // Business rule: each line total = price x quantity, cart total = sum of lines.
    const lines: CartLine[] = cart.products;
    for (const line of lines) {
      expect(line.total).toBeCloseTo(line.price * line.quantity, 2);
    }
    const sum = lines.reduce((acc, line) => acc + line.total, 0);
    expect(cart.total).toBeCloseTo(sum, 2);
  });

  test('GET /carts/user/:id returns only that user carts', async ({ authedRequest }) => {
    const response = await authedRequest.get('/carts/user/33');

    expect(response.status()).toBe(200);
    const { carts } = await response.json();
    // Guard: `every()` on an empty array is true, which would hide a broken endpoint.
    expect(carts.length).toBeGreaterThan(0);
    expect(carts.every((c: { userId: number }) => c.userId === 33)).toBe(true);
  });
});
