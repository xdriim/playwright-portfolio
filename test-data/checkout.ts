export type CustomerInfo = { firstName: string; lastName: string; postalCode: string };

export const customer: CustomerInfo = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '08001',
};

export const checkoutErrors = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;
