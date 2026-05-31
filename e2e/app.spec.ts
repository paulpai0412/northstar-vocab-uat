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

test('supports keyboard study reveal and advance', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('region', { name: /study vocabulary/i }).focus();
  await page.keyboard.press('Enter');

  await expect(
    page.getByText(/able to recover quickly after difficulty/i),
  ).toBeVisible();

  await page.keyboard.press('ArrowRight');

  await expect(page.getByRole('heading', { name: /curious/i })).toBeVisible();
  await expect(page.getByLabel('card progress')).toContainText('2 of 20');
});

test('navigates between learning sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: /learning sections/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /study/i })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.getByRole('button', { name: /quiz/i }).click();
  await expect(page.getByRole('button', { name: /quiz/i })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('region', { name: /quiz readiness/i })).toBeVisible();

  await page.getByRole('button', { name: /progress/i }).click();
  await expect(page.getByRole('button', { name: /progress/i })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByRole('region', { name: /learning progress/i })).toBeVisible();
});

test('reviews study progress and latest quiz outcome together', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /show definition/i }).click();
  await page.getByRole('button', { name: /mark known/i }).click();

  await page.getByRole('button', { name: /quiz/i }).click();
  await page.getByRole('button', { name: /^correct$/i }).click();

  await page.getByRole('button', { name: /progress/i }).click();

  const progressReview = page.getByLabel('progress review summary');

  await expect(progressReview).toContainText('Practiced cards1 of 20');
  await expect(progressReview).toContainText('Latest quiz outcomeCorrect');
  await expect(progressReview).toContainText('Quiz streak1');
});
