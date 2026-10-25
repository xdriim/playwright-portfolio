import { type Locator, type Page } from '@playwright/test';
import { Header } from './components/Header';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly header: Header;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  /** The product card that contains the given product name. */
  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string) {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  /** Prices shown on screen, parsed from "$29.99" to 29.99. */
  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
