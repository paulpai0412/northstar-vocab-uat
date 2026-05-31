import { expect, test } from '@playwright/test';

test('practices a vocabulary card in a real browser', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /practice english vocabulary with focused cards/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /resilient/i })).toBeVisible();

  await page.getByRole('button', { name: /show definition/i }).click();
  await expect(
    page.getByText(/able to recover quickly after difficulty/i),
  ).toBeVisible();

  await page.getByRole('button', { name: /mark known/i }).click();
  await expect(page.getByRole('heading', { name: /curious/i })).toBeVisible();
  await expect(page.getByLabel('practice statistics')).toContainText(
    'practice_words_studied1',
  );
});
