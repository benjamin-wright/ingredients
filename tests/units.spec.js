// @ts-check
import { test, expect } from '@playwright/test';

test('can see units', async ({ page }) => {
  await page.goto('/units');

  await expect(page.getByRole('heading', { name: 'Units' })).toBeVisible();

  const rows = await page.$$('table tbody tr');
  expect(rows).toHaveLength(2);
});
