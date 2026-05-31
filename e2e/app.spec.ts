import { expect, test } from '@playwright/test';

async function expectVisibleContentDoesNotOverlap(
  page: import('@playwright/test').Page,
  selector: string,
) {
  const overlapCount = await page.locator(selector).evaluateAll((elements) => {
    const visibleRects = elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);

        return {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          visibility: style.visibility,
          width: rect.width,
        };
      })
      .filter(
        (rect) =>
          rect.visibility !== 'hidden' &&
          rect.width > 0 &&
          rect.height > 0,
      );

    return visibleRects.filter((rect, index) =>
      visibleRects.some((otherRect, otherIndex) => {
        if (index === otherIndex) {
          return false;
        }

        const horizontalOverlap =
          rect.left < otherRect.right && rect.right > otherRect.left;
        const verticalOverlap =
          rect.top < otherRect.bottom && rect.bottom > otherRect.top;

        return horizontalOverlap && verticalOverlap;
      }),
    ).length;
  });

  expect(overlapCount).toBe(0);
}

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

test('keeps the full UAT learning flow usable on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto('/');

  await expect(page.getByRole('region', { name: /study vocabulary/i })).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 640);

  await page.getByRole('button', { name: /show definition/i }).click();
  await page.getByRole('button', { name: /mark known/i }).click();

  await page.getByRole('button', { name: /quiz/i }).click();
  await expect(page.getByRole('region', { name: /quiz readiness/i })).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 640);
  await page.getByRole('button', { name: /^correct$/i }).click();

  await page.getByRole('button', { name: /progress/i }).click();
  await expect(page.getByRole('region', { name: /learning progress/i })).toBeVisible();
  await expect(page.getByLabel('progress review summary')).toContainText(
    'Latest quiz outcomeCorrect',
  );
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 640);

  const overflowingStats = await page
    .locator('.progress-review div')
    .evaluateAll((cards) =>
      cards.filter((card) => card.scrollWidth > card.clientWidth).length,
    );
  const progressRows = await page
    .locator('.progress-review div')
    .evaluateAll(
      (cards) =>
        new Set(cards.map((card) => card.getBoundingClientRect().top)).size,
    );
  const narrowestProgressStat = await page
    .locator('.progress-review div')
    .evaluateAll((cards) =>
      Math.min(...cards.map((card) => card.getBoundingClientRect().width)),
    );

  expect(overflowingStats).toBe(0);
  expect(progressRows).toBeGreaterThan(1);
  expect(narrowestProgressStat).toBeGreaterThanOrEqual(120);
});

test('keeps study quiz and progress layouts stable at desktop and phone widths', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    await expect(page.locator('body')).toHaveJSProperty(
      'scrollWidth',
      viewport.width,
    );
    await expect(page.getByRole('region', { name: /study vocabulary/i })).toBeVisible();
    await expectVisibleContentDoesNotOverlap(
      page,
      '.panel-header > *, .learning-nav, .hero-copy, .vocab-card, .practice-stats > div, .actions > button',
    );

    await page.getByRole('button', { name: /show definition/i }).click();
    await page.getByRole('button', { name: /mark known/i }).click();

    await page.getByRole('button', { name: /quiz/i }).click();
    await expect(page.locator('body')).toHaveJSProperty(
      'scrollWidth',
      viewport.width,
    );
    await expect(page.getByRole('region', { name: /quiz readiness/i })).toBeVisible();
    await expectVisibleContentDoesNotOverlap(
      page,
      '.section-panel > h2, .section-panel > p, .quiz-card, .quiz-stats > div, .actions > button',
    );

    await page.getByRole('button', { name: /^correct$/i }).click();
    await page.getByRole('button', { name: /progress/i }).click();

    await expect(page.locator('body')).toHaveJSProperty(
      'scrollWidth',
      viewport.width,
    );
    await expect(page.getByRole('region', { name: /learning progress/i })).toBeVisible();
    await expect(page.getByLabel('progress review summary')).toContainText(
      'Latest quiz outcomeCorrect',
    );
    await expectVisibleContentDoesNotOverlap(
      page,
      '.section-panel > h2, .progress-review > div',
    );
  }
});
