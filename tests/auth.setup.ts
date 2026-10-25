import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { users } from '@data/users';
import { STORAGE_STATE } from '../playwright.config';

/**
 * Logs in through the UI once and saves cookies/localStorage to a file.
 * The e2e projects load that file, so most tests skip the login screen.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard);
  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({ path: STORAGE_STATE });
});
