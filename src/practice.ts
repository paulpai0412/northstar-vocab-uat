import type { VocabularyItem } from './vocabulary';

export type PracticeSession = {
  currentIndex: number;
  isRevealed: boolean;
  knownWords: string[];
  latestQuizOutcome: 'correct' | 'incorrect' | null;
  needsReviewWords: string[];
  quizStreak: number;
  studiedCount: number;
  totalCards: number;
};

export function createPracticeSession(deck: VocabularyItem[]): PracticeSession {
  return {
    currentIndex: 0,
    isRevealed: false,
    knownWords: [],
    latestQuizOutcome: null,
    needsReviewWords: [],
    quizStreak: 0,
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

export function answerCurrentQuizWord(
  session: PracticeSession,
  deck: VocabularyItem[],
  isCorrect: boolean,
): PracticeSession {
  const nextIndex = getNextIndex(session, deck);

  return {
    ...session,
    currentIndex: nextIndex,
    isRevealed: false,
    latestQuizOutcome: isCorrect ? 'correct' : 'incorrect',
    quizStreak: isCorrect ? session.quizStreak + 1 : 0,
  };
}

function markCurrentWord(
  session: PracticeSession,
  deck: VocabularyItem[],
  outcome: 'known' | 'needs-review',
): PracticeSession {
  const currentWord = deck[session.currentIndex]?.word;
  const nextIndex = getNextIndex(session, deck);

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

function getNextIndex(session: PracticeSession, deck: VocabularyItem[]): number {
  const totalCards = session.totalCards || deck.length;

  return totalCards > 0 ? (session.currentIndex + 1) % totalCards : 0;
}
