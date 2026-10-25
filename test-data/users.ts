/**
 * Public demo accounts published on the saucedemo.com login page.
 * They are not secrets, so keeping them in the repo is fine.
 */
const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
  problem: { username: 'problem_user', password: PASSWORD },
  wrongPassword: { username: 'standard_user', password: 'wrong_password' },
  unknown: { username: 'not_a_user', password: PASSWORD },
} as const;

export type User = { username: string; password: string };

/** Exact error messages shown by the app, used as expected results. */
export const loginErrors = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  badCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
} as const;
