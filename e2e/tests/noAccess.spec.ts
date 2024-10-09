/**
 * Testing results when the user has no access to PIMS due to their missing role or non-Active status.
 */

import {test, expect} from "@playwright/test";
import { loginBCServicesCard } from "../functions/login";

const createSelfResponse = (props?) => ({
  "CreatedById": "00000000-0000-0000-0000-000000000000",
  "CreatedOn": "2023-07-25T00:32:41.938Z",
  "UpdatedById": "a619c656-b263-4a17-9b87-03459f43b349",
  "UpdatedOn": "2024-10-09T23:49:47.650Z",
  "Id": "a619c656-b263-4a17-9b87-03459f43b352",
  "Username": "a619c656b2634a179b8703459f43b529@idir",
  "FirstName": "Joe",
  "MiddleName": null,
  "LastName": "Tester",
  "Email": "user.email@gov.bc.ca",
  "Position": "Developer",
  "IsDisabled": false,
  "Note": null,
  "LastLogin": "2024-10-09T16:49:47.629Z",
  "ApprovedById": "80e0111a-b56c-48dd-b55e-f99f2205c4bd",
  "ApprovedOn": "2023-08-26T03:03:47.911Z",
  "KeycloakUserId": "a619c656-b263-4a17-9b87-03459f43b352",
  "AgencyId": 2,
  "RoleId": "00000000-0000-0000-0000-000000000000",
  "Status": "Active",
  ...props,
})

test('user without a role get the no-role page', async ({ page }) => {
  await page.route('**/users/self', route => route.fulfill({
    status: 200,
    body: JSON.stringify(createSelfResponse({ RoleId: undefined })),
  }));
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Awaiting Role' })).toBeVisible();
})

test('user with On Hold status should get ____ page', async ({ page }) => {
  await page.route('**/users/self', route => route.fulfill({
    status: 200,
    body: JSON.stringify(createSelfResponse({ Status: 'OnHold' })),
  }));
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Access Pending' })).toBeVisible();
})

test('user with Disabled status should get ____ page', async ({ page }) => {
  await page.route('**/users/self', route => route.fulfill({
    status: 200,
    body: JSON.stringify(createSelfResponse({ Status: 'Disabled' })),
  }));
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Account Inactive' })).toBeVisible();
})

test('user with Denied status should get ____ page', async ({ page }) => {
  await page.route('**/users/self', route => route.fulfill({
    status: 200,
    body: JSON.stringify(createSelfResponse({ Status: 'Denied' })),
  }));
  await loginBCServicesCard({ page });
  await expect(page.getByRole('heading', { name: 'Account Inactive' })).toBeVisible();
})
