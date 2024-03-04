// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Nom Nom/);
});

test('can see units', async ({ page }) => {
  await page.goto('/units');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Nom Nom/);

  const units = await page.getByText('Units');
  expect(units).not.toBeNull();
});
