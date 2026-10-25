import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { apiUser } from '@data/api';

type ApiFixtures = {
  /** A request client that already sends `Authorization: Bearer <token>`. */
  authedRequest: APIRequestContext;
};

type ApiWorkerFixtures = {
  /** Logged in once per worker and reused by every test in that worker. */
  accessToken: string;
};

export const test = base.extend<ApiFixtures, ApiWorkerFixtures>({
  accessToken: [
    async ({ playwright }, use) => {
      const request = await playwright.request.newContext({ baseURL: 'https://dummyjson.com' });
      const response = await request.post('/auth/login', { data: apiUser });
      expect(response.ok(), 'login for the API fixture should succeed').toBeTruthy();
      const { accessToken } = await response.json();
      await request.dispose();
      await use(accessToken);
    },
    { scope: 'worker' },
  ],

  authedRequest: async ({ playwright, accessToken }, use) => {
    const request = await playwright.request.newContext({
      baseURL: 'https://dummyjson.com',
      extraHTTPHeaders: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    await use(request);
    await request.dispose();
  },
});

export { expect };
