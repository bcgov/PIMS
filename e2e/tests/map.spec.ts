import { test, expect, Page } from "@playwright/test";
import { BASE_URL } from "../env";
import { loginIDIR } from "../functions/login";

test('user can view all parts of map', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginIDIR(page);
  // Leaflet map is visible
  await page.waitForLoadState();
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Controls on map are visible
  await expect(page.getByRole('link', { name: 'Draw a polygon' })).toBeVisible();
  await expect(page.getByLabel('Zoom in')).toBeVisible();
  // At least one property is rendered as a cluster
  await expect(page.locator('.cluster-marker').first()).toBeVisible();
})

test('sidebar controls work as expected (not filter)', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginIDIR(page);
  // Leaflet map is visible
  await page.waitForLoadState();
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Sidebar is visible
  await expect(page.locator('#map-sidebar')).toBeVisible();
  // Sidebar has properties (also ensures that properties were loaded first)
  await expect(page.locator('.property-row').first()).toBeVisible();

  // Can click sidebar navigation and it affects value
  await expect(page.locator('#sidebar-count')).toContainText('1 of');
  // Up
  await page.locator('#sidebar-increment').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#sidebar-count')).toContainText('2 of');
  // Down
  await page.locator('#sidebar-decrement').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#sidebar-count')).toContainText('1 of');
  // Down again
  await page.locator('#sidebar-decrement').click();
  await page.waitForLoadState('networkidle');
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
  const getPropertyCount = async (page: Page) => {
    await page.locator('#sidebar-count').waitFor();
    const sidebarCount = await page.locator('#sidebar-count').textContent();
    return parseInt(sidebarCount?.match(/\((.+)\)/)?.at(1)?.split(' ').at(0)?.replaceAll(',', '')!)
  }

  await page.goto(BASE_URL);
  await loginIDIR(page);
  // Leaflet map is visible
  await page.waitForLoadState();
  await expect(page.locator('#parcel-map')).toBeVisible();
  // Sidebar has properties (also ensures that properties were loaded first)
  await expect(page.locator('.property-row').first()).toBeVisible();
  // Get starting number of properties
  const startingNumber = await getPropertyCount(page)

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
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]);
  const afterAgencies = await getPropertyCount(page);
  expect(afterAgencies).toBeLessThan(startingNumber);

  await page.locator('div').filter({ hasText: /^Property Types$/ }).getByLabel('Open').click();
  await page.getByText('Land', { exact: true }).click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]);
  const afterPropertyTypes = await getPropertyCount(page);
  expect(afterPropertyTypes).toBeLessThan(afterAgencies);

  await page.locator('div').filter({ hasText: /^Regional Districts$/ }).getByLabel('Open').click();
  await page.getByLabel('Regional Districts').fill('cap');
  await page.getByText('Capital Regional District').click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]); const afterRegionalDistricts = await getPropertyCount(page);
  expect(afterRegionalDistricts).toBeLessThan(afterPropertyTypes);

  await page.locator('div').filter({ hasText: /^Administrative Areas$/ }).getByLabel('Open').click();
  await page.getByLabel('Administrative Areas').fill('vic');
  await page.getByRole('option', { name: 'Victoria' }).click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]); const afterAdminAreas = await getPropertyCount(page);
  expect(afterAdminAreas).toBeLessThan(afterRegionalDistricts);

  await page.getByLabel('Classifications').click();
  await page.getByText('Core Operational').click();
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Filter' }).click(),
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]); const afterClassifications = await getPropertyCount(page);
  expect(afterClassifications).toBeLessThan(afterAdminAreas);

  // Clear and get back original number
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/search/geo')),
    page.getByRole('button', { name: 'Clear' }).click(),
    page.waitForTimeout(1000) // Otherwise counter doesn't update in time
  ]);
  const afterClear = await getPropertyCount(page);
  expect(afterClear).toEqual(startingNumber);

  // Check visibility of filter when opening and closing sidebar
  await page.locator('#sidebar-button-close').click();
  await page.locator('#map-filter-container').waitFor();
  await expect(page.locator('#map-filter-container')).not.toBeInViewport();
  // Return sidebar/filter
  await page.locator('#sidebar-button').getByRole('img').click();
  await expect(page.locator('#map-filter-container')).toBeInViewport();
  // Close filter
  await page.locator('#map-sidebar').getByRole('button').first().waitFor();
  await page.locator('#map-sidebar').getByRole('button').first().click();
  await page.locator('#map-filter-container').waitFor();
  await expect(page.locator('#map-filter-container')).not.toBeInViewport();
})
