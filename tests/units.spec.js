// @ts-check
import { test, expect } from '@playwright/test';

test('can see units', async ({ page }) => {
  await page.goto('/units');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Nom Nom/);

  await expect(page.getByRole('heading', { name: 'Units' })).toBeVisible();
});
