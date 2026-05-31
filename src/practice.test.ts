import { describe, expect, it } from 'vitest';
import {
  createPracticeSession,
  markCurrentWordKnown,
  markCurrentWordNeedsReview,
  revealCurrentCard,
} from './practice';
import { vocabularySeedDeck } from './vocabulary';

describe('practice session transitions', () => {
  it('reveals definition content for the current card', () => {
    const session = createPracticeSession(vocabularySeedDeck);

    expect(session.isRevealed).toBe(false);

    expect(revealCurrentCard(session)).toMatchObject({
      currentIndex: 0,
      isRevealed: true,
      studiedCount: 0,
    });
  });

  it('marks the current word as known and advances to the next hidden card', () => {
    const session = revealCurrentCard(createPracticeSession(vocabularySeedDeck));

    expect(markCurrentWordKnown(session, vocabularySeedDeck)).toMatchObject({
      currentIndex: 1,
      isRevealed: false,
      studiedCount: 1,
      knownWords: ['resilient'],
      needsReviewWords: [],
    });
  });

  it('marks the current word as needs review and advances to the next hidden card', () => {
    const session = revealCurrentCard(createPracticeSession(vocabularySeedDeck));

    expect(markCurrentWordNeedsReview(session, vocabularySeedDeck)).toMatchObject({
      currentIndex: 1,
      isRevealed: false,
      studiedCount: 1,
      knownWords: [],
      needsReviewWords: ['resilient'],
    });
  });
});
