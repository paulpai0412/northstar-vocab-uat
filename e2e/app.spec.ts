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

  await page.getByRole('button', { name: /next word/i }).click();
  await expect(page.getByRole('heading', { name: /curious/i })).toBeVisible();
});

test('answers a quiz question in a real browser', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /quiz mode/i }).click();
  await expect(
    page.getByRole('heading', {
      name: /what does "resilient" mean\?/i,
    }),
  ).toBeVisible();

  await page
    .getByRole('button', {
      name: /able to recover quickly after difficulty or change/i,
    })
    .click();

  await expect(page.getByRole('status')).toContainText(/correct\. resilient/i);

  const quizQuestionsAnswered = await page
    .getByTestId('quiz-questions-answered')
    .textContent();
  const quiz_questions_answered = Number(quizQuestionsAnswered);

  expect(quiz_questions_answered).toBeGreaterThanOrEqual(1);
});
