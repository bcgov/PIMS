/**
 * Testing navigating to Agency Table and using some filter functions.
 * There are some assumptions that you will have some standard agencies populated.
 */

import { test, expect, Page } from '@playwright/test'
import { BASE_URL } from '../env';
import { loginIDIR } from '../functions/login';
import { mockSelf } from '../functions/mockRequests';

const getToAgencies = async (page: Page) => {
  await page.goto(BASE_URL);
  await mockSelf(page, { RoleId: "00000000-0000-0000-0000-000000000000" }); // guarantee admin status
  await loginIDIR(page);

  await page.getByRole('heading', { name: 'Administration' }).click();
  await page.getByRole('menuitem', { name: 'Agencies' }).click();
  await page.getByText('Agencies Overview');
}

test('user can navigate to agencies page as an admin', async ({ page }) => {
  await getToAgencies(page);
  await expect(page.getByText('Agencies Overview')).toBeVisible();
})

test('user can filter using the keyword search', async ({ page }) => {
  await getToAgencies(page);

  await page.getByTestId('SearchIcon').click();
  await page.getByPlaceholder('Search...').click();
  await page.getByPlaceholder('Search...').fill('real');
  await expect(page.getByRole('gridcell', { name: 'Real Property Division' })).toBeVisible();
  // Clear filter and make sure it is empty
  await page.getByLabel('Clear Filter').click();
  await expect(page.getByPlaceholder('Search...')).toBeEmpty();
  await expect(page.getByLabel('Clear Filter')).not.toBeVisible();
})

test('user can filter using the select dropdown', async ({ page }) => {
  await getToAgencies(page);

  await page.getByText('All Agencies').click();
  await page.getByRole('option', { name: 'Disabled', exact: true }).click();
  // Not clear what to look for here to guarantee that only Disabled agencies show
  await expect(page.getByTestId('FilterAltIcon')).toBeVisible(); // The icon in the column header
  await expect(page.getByLabel('Clear Filter')).toBeVisible();
  await page.getByLabel('Clear Filter').click();
  await expect(page.getByLabel('Clear Filter')).not.toBeVisible();
})

test('user can filter using the column filter', async ({ page }) => {
  await getToAgencies(page);

  await page.getByText('Name', { exact: true }).hover();
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitem', { name: 'Filter' }).click();
  await page.getByPlaceholder('Filter value').click();
  await page.getByPlaceholder('Filter value').fill('real');
  await page.getByText('Agencies Overview (1 rows)All').click(); // To get filter off screen
  await expect(page.getByRole('gridcell', { name: 'Real Property Division' })).toBeVisible();
})

test('user select a row and go to that agency', async ({ page }) => {
  await getToAgencies(page);

  await page.getByRole('gridcell', { name: 'Advanced Education & Skills' }).first().click();
  // These two expects together should confirm user is on correct details page
  await expect(page.getByText('Agency Details')).toBeVisible();
  await expect(page.getByText('Advanced Education & Skills')).toBeVisible();
})
