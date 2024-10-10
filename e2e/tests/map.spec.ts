import { test, expect } from "@playwright/test";
import { BASE_URL } from "../env";
import { loginIDIR } from "../functions/login";

test('user can view all parts of map', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginIDIR({ page });
  // Leaflet map is visible
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Controls on map are visible
  await expect(page.getByRole('link', { name: 'Draw a polygon' })).toBeVisible();
  await expect(page.getByLabel('Zoom in')).toBeVisible();
  // At least one property is rendered as a cluster
  await expect(page.locator('.cluster-marker').first()).toBeVisible();
})

test('sidebar controls work as expected (not filter)', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginIDIR({ page });
  // Leaflet map is visible
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Sidebar is visible
  await expect(page.locator('#map-sidebar')).toBeVisible();
  // Sidebar has properties (also ensures that properties were loaded first)
  await expect(page.locator('.property-row').first()).toBeVisible();

  // Can click sidebar navigation and it affects value
  await expect(page.locator('#sidebar-count')).toContainText('1 of');
  // Up
  await page.locator('#sidebar-increment').click();
  await expect(page.locator('#sidebar-count')).toContainText('2 of');
  // Down
  await page.locator('#sidebar-decrement').click();
  await expect(page.locator('#sidebar-count')).toContainText('1 of');
  // Down again
  await page.locator('#sidebar-decrement').click();
  await expect(page.locator('#sidebar-count')).toContainText('1 of');

  // Can hide and unhide sidebar
  await page.locator('#sidebar-button-close').click();
  // Sidebar should be off screen
  await expect(page.locator('#map-sidebar')).not.toBeInViewport();
  // Click again and see sidebar
  await page.locator('#sidebar-button').click();
  await expect(page.locator('#map-sidebar')).toBeInViewport();
})

test('user can filter map properties', async ({ page }) => {
  const getSnackbarCount = async () => {
    const snackbarCount = await page.locator('#snackbar-popup').textContent()
    return parseInt(snackbarCount?.split(' ').at(0)!)
  }

  await page.goto(BASE_URL);
  await loginIDIR({ page });
  // Leaflet map is visible
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Sidebar has properties (also ensures that properties were loaded first)
  await expect(page.locator('.property-row').first()).toBeVisible();
  // Get starting number of properties
  const startingNumber = await getSnackbarCount()

  // Open filter
  await page.locator('#map-filter-open').click();
  await expect(page.locator('#map-filter-container')).toBeInViewport();

  // Enter values in the filters and check if the number goes lower each time
  await page.getByLabel('Agencies').click();
  await page.getByRole('combobox', { name: 'Agencies' }).fill('real');
  await page.getByRole('listbox', { name: 'Agencies' }).locator('span').click();
  await page.getByRole('button', { name: 'Filter' }).click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
  ]);
  const afterAgencies = await getSnackbarCount();
  expect(afterAgencies).toBeLessThan(startingNumber);

  await page.locator('div').filter({ hasText: /^Property Types$/ }).getByLabel('Open').click();
  await page.getByText('Land', { exact: true }).click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
  ]);  const afterPropertyTypes = await getSnackbarCount();
  expect(afterPropertyTypes).toBeLessThan(afterAgencies);

  await page.locator('div').filter({ hasText: /^Regional Districts$/ }).getByLabel('Open').click();
  await page.getByLabel('Regional Districts').fill('cap');
  await page.getByText('Capital Regional District').click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
  ]);  const afterRegionalDistricts = await getSnackbarCount();
  expect(afterRegionalDistricts).toBeLessThan(afterPropertyTypes);

  await page.locator('div').filter({ hasText: /^Administrative Areas$/ }).getByLabel('Open').click();
  await page.getByLabel('Administrative Areas').fill('vic');
  await page.getByRole('option', { name: 'Victoria' }).click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
  ]);  const afterAdminAreas = await getSnackbarCount();
  expect(afterAdminAreas).toBeLessThan(afterRegionalDistricts);

  await page.getByLabel('Classifications').click();
  await page.getByText('Core Operational').click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
  ]);  const afterClassifications = await getSnackbarCount();
  expect(afterClassifications).toBeLessThan(afterAdminAreas);

  // Clear and get back original number
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Clear' }).click(),
    new Promise(resolve => setTimeout(resolve, 1000)) // Otherwise snackbar doesn't open in time
  ]);  
  const afterClear = await getSnackbarCount();
  expect(afterClear).toEqual(startingNumber);

  // Check visibility of filter when opening and closing sidebar
  await page.locator('#sidebar-button-close').click();
  await expect(page.locator('#map-filter-container')).not.toBeInViewport();
  // Return sidebar/filter
  await page.locator('#sidebar-button').getByRole('img').click();
  await expect(page.locator('#map-filter-container')).toBeInViewport();
  // Close filter
  await page.locator('#map-sidebar').getByRole('button').first().click();
  await expect(page.locator('#map-filter-container')).not.toBeInViewport();
})
