/**
 * Functions for automating user logins. 
 */

import {BASE_URL, BCEID_PASSWORD, BCEID_USERNAME, BCSC_PASSWORD, BCSC_USERNAME} from '../env';

// Will only work in DEV/TEST environments
export const loginBCServicesCard = async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'BC Services Card' }).click();
  await page.getByLabel('Log in with Test with').click();
  await page.getByLabel('Email or username').click();
  await page.getByLabel('Email or username').fill(BCSC_USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(BCSC_PASSWORD);
  await page.getByRole('button', { name: 'Continue' }).click();
};

export const loginBCeID = async ({ page }) => {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Basic or Business BCeID' }).click();
  await page.locator('#user').fill(BCEID_USERNAME);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(BCEID_PASSWORD);
  await page.getByRole('button', { name: 'Continue' }).click();
};
