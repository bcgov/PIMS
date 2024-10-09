import { test, expect } from '@playwright/test';
import { loginBCServicesCard, loginBCeID } from '../functions/login';

test('log in with BC Services Card', async ({ page }) => {
  await loginBCServicesCard({ page });
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('log in with BCeID', async ({ page }) => {
  await loginBCeID({ page });
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
