import { test, expect } from '@fixtures/api';
import { apiUser } from '@data/api';

test.describe('Auth API', () => {
  test('POST /auth/login returns tokens for valid credentials', { tag: '@smoke' }, async ({ request }) => {
    const response = await request.post('/auth/login', { data: apiUser });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ username: apiUser.username });
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.refreshToken).toEqual(expect.any(String));
  });

  test('POST /auth/login rejects a wrong password', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: apiUser.username, password: 'wrong' },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ message: 'Invalid credentials' });
  });

  test('GET /auth/me returns the logged-in user', async ({ authedRequest }) => {
    const response = await authedRequest.get('/auth/me');

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ id: 1, username: apiUser.username });
  });

  test('GET /auth/me without a token is unauthorized', async ({ request }) => {
    const response = await request.get('/auth/me');

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ message: 'Access Token is required' });
  });

  test('GET /auth/me with an invalid token is unauthorized', async ({ request }) => {
    const response = await request.get('/auth/me', {
      headers: { Authorization: 'Bearer not-a-real-token' },
    });

    expect(response.status()).toBe(401);
  });
});
