/**
 * Public demo user documented by dummyjson.com (https://dummyjson.com/docs/auth).
 * Not a secret: it is the same for everyone.
 */
export const apiUser = {
  username: 'emilys',
  password: 'emilyspass',
} as const;

export const newProduct = {
  title: 'Playwright Test Mug',
  price: 12.5,
  category: 'kitchen-accessories',
} as const;
