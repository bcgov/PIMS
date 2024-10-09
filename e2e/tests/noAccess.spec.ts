/**
 * Testing results when the user has no access to PIMS due to their missing role or non-Active status.
 * This might be unnecessary, as we are essentially mocking the API response anyway.
 */

import { test, expect } from "@playwright/test";
import { loginBCServicesCard } from "../functions/login";
import { mockSelf } from "../functions/mockRequests";


test('user without a role get the no-role page', async ({ page }) => {
  await mockSelf(page, { RoleId: undefined });
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Awaiting Role' })).toBeVisible();
})

test('user with On Hold status should get ____ page', async ({ page }) => {
  await mockSelf(page, { Status: 'OnHold' });
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Access Pending' })).toBeVisible();
})

test('user with Disabled status should get ____ page', async ({ page }) => {
  await mockSelf(page, { Status: 'Disabled' });
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Account Inactive' })).toBeVisible();
})

test('user with Denied status should get ____ page', async ({ page }) => {
  await mockSelf(page, { Status: 'Denied' });
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Account Inactive' })).toBeVisible();
})
