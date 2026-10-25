import { type Locator, type Page } from '@playwright/test';
import { Header } from './components/Header';

export class CartPage {
  readonly header: Header;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async removeItem(productName: string) {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
