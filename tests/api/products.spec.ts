import { test, expect } from '@fixtures/api';
import { newProduct } from '@data/api';

/**
 * Note: dummyjson.com simulates writes. POST/PUT/DELETE return realistic
 * responses but nothing is persisted, so each test checks the response only.
 */
test.describe('Products API', () => {
  test('GET /products returns a paginated list', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.get('/products', { params: { limit: 5, skip: 10 } });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.products).toHaveLength(5);
    expect(body).toMatchObject({ skip: 10, limit: 5 });
    expect(body.total).toBeGreaterThan(5);
  });

  test('GET /products/:id returns a product with the expected shape', async ({ request }) => {
    const response = await request.get('/products/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    // Contract-style check: we care about types, not exact values.
    expect(await response.json()).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      stock: expect.any(Number),
    });
  });

  test('GET /products/:id returns 404 for a product that does not exist', async ({ request }) => {
    const response = await request.get('/products/99999');

    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ message: "Product with id '99999' not found" });
  });

  test('GET /products/search only returns matching products', async ({ request }) => {
    const response = await request.get('/products/search', { params: { q: 'phone', select: 'title,description' } });

    expect(response.status()).toBe(200);
    const { products } = await response.json();
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(`${product.title} ${product.description}`.toLowerCase()).toContain('phone');
    }
  });

  test('GET /products/category/:slug only returns that category', async ({ request }) => {
    const response = await request.get('/products/category/smartphones');

    expect(response.status()).toBe(200);
    const { products } = await response.json();
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p: { category: string }) => p.category === 'smartphones')).toBe(true);
  });

  test('POST /products/add creates a product', async ({ authedRequest }) => {
    const response = await authedRequest.post('/products/add', { data: newProduct });

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ id: expect.any(Number), ...newProduct });
  });

  test('PUT /products/:id updates only the sent fields', async ({ authedRequest }) => {
    const response = await authedRequest.put('/products/1', { data: { price: 1.5 } });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ id: 1, price: 1.5 });
    expect(body.title).toEqual(expect.any(String));
  });

  test('DELETE /products/:id marks the product as deleted', async ({ authedRequest }) => {
    const response = await authedRequest.delete('/products/1');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ id: 1, isDeleted: true });
    expect(new Date(body.deletedOn).toString()).not.toBe('Invalid Date');
  });
});
