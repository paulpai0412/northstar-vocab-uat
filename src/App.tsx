import { useMemo, useState } from 'react';
import { loadVocabularyDeck, vocabularySeedDeck } from './vocabulary';

const vocabulary = loadVocabularyDeck(vocabularySeedDeck);

export function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);

  const currentCard = vocabulary[currentIndex];
  const progress = useMemo(
    () => `${currentIndex + 1} of ${vocabulary.length}`,
    [currentIndex],
  );

  function handleNextCard() {
    setShowDefinition(false);
    setCurrentIndex((index) => (index + 1) % vocabulary.length);
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

          {showDefinition ? (
            <div className="definition-block">
              <p>{currentCard.definition}</p>
              <q>{currentCard.exampleSentence}</q>
            </div>
          ) : (
            <p className="prompt">Try to define the word before revealing it.</p>
          )}
        </article>

        <div className="actions">
          <button type="button" onClick={() => setShowDefinition(true)}>
            Show definition
          </button>
          <button type="button" className="secondary" onClick={handleNextCard}>
            Next word
          </button>
        </div>
      </section>
    </main>
  );
}
