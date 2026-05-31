import { type KeyboardEvent, useMemo, useState } from 'react';
import {
  createPracticeSession,
  markCurrentWordKnown,
  markCurrentWordNeedsReview,
  revealCurrentCard,
} from './practice';
import { loadVocabularyDeck, vocabularySeedDeck } from './vocabulary';

const vocabulary = loadVocabularyDeck(vocabularySeedDeck);
type LearningSection = 'study' | 'quiz' | 'progress';

const learningSections: Array<{ id: LearningSection; label: string }> = [
  { id: 'study', label: 'Study' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'progress', label: 'Progress' },
];

export function App() {
  const [session, setSession] = useState(() => createPracticeSession(vocabulary));
  const [activeSection, setActiveSection] = useState<LearningSection>('study');

  const currentCard = vocabulary[session.currentIndex];
  const progress = useMemo(
    () => `${session.currentIndex + 1} of ${session.totalCards}`,
    [session.currentIndex, session.totalCards],
  );

  function handleKnown() {
    setSession((currentSession) =>
      markCurrentWordKnown(currentSession, vocabulary),
    );
  }

  function handleNeedsReview() {
    setSession((currentSession) =>
      markCurrentWordNeedsReview(currentSession, vocabulary),
    );
  }

  function handleReveal() {
    setSession((currentSession) => revealCurrentCard(currentSession));
  }

  function handleStudyKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' && !session.isRevealed) {
      event.preventDefault();
      handleReveal();
      return;
    }

    if (event.key === 'ArrowRight' && session.isRevealed) {
      event.preventDefault();
      handleKnown();
    }
  }

  const quizReadyCount = session.knownWords.length;
  const reviewCount = session.needsReviewWords.length;

  return (
    <main className="app-shell">
      <section className="practice-panel" aria-labelledby="app-title">
        <div className="panel-header">
          <p className="brand">Northstar Vocab</p>
          <span className="progress" aria-label="card progress">
            {progress}
          </span>
        </div>

        <nav className="learning-nav" aria-label="Learning sections">
          {learningSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="nav-button"
              aria-current={activeSection === section.id ? 'page' : undefined}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="hero-copy">
          <h1 id="app-title">Practice English vocabulary with focused cards.</h1>
          <p>
            Read the word, recall the meaning, then reveal the definition and
            example sentence.
          </p>
        </div>

        {activeSection === 'study' ? (
          <section
            aria-describedby="study-shortcuts"
            aria-label="Study vocabulary"
            onKeyDown={handleStudyKeyDown}
            tabIndex={0}
          >
            <p id="study-shortcuts" className="sr-only">
              Press Enter to show the definition. After the answer is shown, press
              Arrow Right to mark known and move to the next card.
            </p>
            <article className="vocab-card">
              <p className="card-label">Today&apos;s word</p>
              <h2>{currentCard.word}</h2>
              <p className="part-of-speech">{currentCard.partOfSpeech}</p>
              <p className="pronunciation">{currentCard.pronunciationHint}</p>

              {session.isRevealed ? (
                <div className="definition-block">
                  <p>{currentCard.definition}</p>
                  <q>{currentCard.exampleSentence}</q>
                </div>
              ) : (
                <p className="prompt">Try to define the word before revealing it.</p>
              )}
            </article>

            <dl className="practice-stats" aria-label="practice statistics">
              <div>
                <dt>practice_words_studied</dt>
                <dd>{session.studiedCount}</dd>
              </div>
              <div>
                <dt>Known</dt>
                <dd>{session.knownWords.length}</dd>
              </div>
              <div>
                <dt>Needs review</dt>
                <dd>{reviewCount}</dd>
              </div>
            </dl>

            <div className="actions">
              <button
                type="button"
                onClick={handleReveal}
              >
                Show definition
              </button>
              <button type="button" className="secondary" onClick={handleKnown}>
                Mark known
              </button>
              <button type="button" className="secondary" onClick={handleNeedsReview}>
                Needs review
              </button>
            </div>
          </section>
        ) : null}

        {activeSection === 'quiz' ? (
          <section className="section-panel" aria-label="Quiz readiness">
            <h2>Quiz readiness</h2>
            <p>
              {quizReadyCount} known words are ready for quiz practice. Keep studying
              to unlock stronger recall.
            </p>
          </section>
        ) : null}

        {activeSection === 'progress' ? (
          <section className="section-panel" aria-label="Learning progress">
            <h2>Learning progress</h2>
            <dl className="practice-stats" aria-label="progress statistics">
              <div>
                <dt>Studied</dt>
                <dd>{session.studiedCount}</dd>
              </div>
              <div>
                <dt>Known</dt>
                <dd>{quizReadyCount}</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>{reviewCount}</dd>
              </div>
            </dl>
          </section>
        ) : null}
      </section>
    </main>
  );
}
