import type { VocabularyItem } from './vocabulary';

export type PracticeSession = {
  currentIndex: number;
  isRevealed: boolean;
  knownWords: string[];
  needsReviewWords: string[];
  studiedCount: number;
  totalCards: number;
};

export function createPracticeSession(deck: VocabularyItem[]): PracticeSession {
  return {
    currentIndex: 0,
    isRevealed: false,
    knownWords: [],
    needsReviewWords: [],
    studiedCount: 0,
    totalCards: deck.length,
  };
}

export function revealCurrentCard(session: PracticeSession): PracticeSession {
  return {
    ...session,
    isRevealed: true,
  };
}

export function markCurrentWordKnown(
  session: PracticeSession,
  deck: VocabularyItem[],
): PracticeSession {
  return markCurrentWord(session, deck, 'known');
}

export function markCurrentWordNeedsReview(
  session: PracticeSession,
  deck: VocabularyItem[],
): PracticeSession {
  return markCurrentWord(session, deck, 'needs-review');
}

function markCurrentWord(
  session: PracticeSession,
  deck: VocabularyItem[],
  outcome: 'known' | 'needs-review',
): PracticeSession {
  const currentWord = deck[session.currentIndex]?.word;
  const nextIndex = (session.currentIndex + 1) % session.totalCards;

  return {
    ...session,
    currentIndex: nextIndex,
    isRevealed: false,
    studiedCount: session.studiedCount + 1,
    knownWords:
      outcome === 'known' && currentWord
        ? [...session.knownWords, currentWord]
        : session.knownWords,
    needsReviewWords:
      outcome === 'needs-review' && currentWord
        ? [...session.needsReviewWords, currentWord]
        : session.needsReviewWords,
  };
}
