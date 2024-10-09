import { test, expect } from "@playwright/test";
import { BASE_URL } from "../../env";
import { loginIDIR } from "../../functions/login";

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
  await expect(page.locator('#map-sidebar')).toContainText('1 of');
  // Up
  await page.locator('#sidebar-increment').click({timeout: 10000});
  await expect(page.locator('#map-sidebar')).toContainText('2 of');
  // Down
  await page.locator('#sidebar-decrement').click();
  await expect(page.locator('#map-sidebar')).toContainText('1 of');
  // Down again
  await page.locator('#sidebar-decrement').click();
  await expect(page.locator('#map-sidebar')).toContainText('1 of');

  // Can hide and unhide sidebar
  await page.locator('#sidebar-button-close').click();
  // Sidebar should be off screen
  await expect(page.locator('#map-sidebar')).not.toBeInViewport();
  // Click again and see sidebar
  await page.locator('#sidebar-button').click();
  await expect(page.locator('#map-sidebar')).toBeInViewport();
})
