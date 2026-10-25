import { test, expect } from '@fixtures/pages';
import { users, loginErrors } from '@data/users';

// These tests ARE about logging in, so they start without the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list', { tag: '@smoke' }, async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('user can log out and lands back on the login page', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard);
    await inventoryPage.header.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test.describe('negative cases', () => {
    // Data-driven: one test per row, same steps, different input and expected error.
    const cases = [
      { name: 'locked out user', user: users.lockedOut, error: loginErrors.lockedOut },
      { name: 'wrong password', user: users.wrongPassword, error: loginErrors.badCredentials },
      { name: 'unknown user', user: users.unknown, error: loginErrors.badCredentials },
      { name: 'empty username', user: { username: '', password: 'secret_sauce' }, error: loginErrors.usernameRequired },
      { name: 'empty password', user: { username: 'standard_user', password: '' }, error: loginErrors.passwordRequired },
    ];

    for (const { name, user, error } of cases) {
      test(`shows an error for ${name}`, async ({ loginPage, page }) => {
        await loginPage.login(user);

        await expect(loginPage.errorMessage).toHaveText(error);
        await expect(page).not.toHaveURL(/inventory\.html/);
      });
    }
  });

  test('protected pages redirect to login when not authenticated', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await expect(loginPage.errorMessage).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
