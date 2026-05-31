import { useMemo, useState } from 'react';
import {
  createPracticeSession,
  markCurrentWordKnown,
  markCurrentWordNeedsReview,
  revealCurrentCard,
} from './practice';
import { loadVocabularyDeck, vocabularySeedDeck } from './vocabulary';

const vocabulary = loadVocabularyDeck(vocabularySeedDeck);

export function App() {
  const [session, setSession] = useState(() => createPracticeSession(vocabulary));

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

  return (
    <main className="app-shell">
      <section className="practice-panel" aria-labelledby="app-title">
        <div className="panel-header">
          <p className="brand">Northstar Vocab</p>
          <span className="progress" aria-label="card progress">
            {progress}
          </span>
        </div>

        <div className="hero-copy">
          <h1 id="app-title">Practice English vocabulary with focused cards.</h1>
          <p>
            Read the word, recall the meaning, then reveal the definition and
            example sentence.
          </p>
        </div>

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
            <dd>{session.needsReviewWords.length}</dd>
          </div>
        </dl>

        <div className="actions">
          <button
            type="button"
            onClick={() => setSession((currentSession) => revealCurrentCard(currentSession))}
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
    </main>
  );
}
