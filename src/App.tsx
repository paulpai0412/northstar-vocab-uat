import { useMemo, useState } from 'react';
import {
  answerQuizQuestion,
  createQuizQuestions,
  loadVocabularyDeck,
  vocabularySeedDeck,
} from './vocabulary';

const vocabulary = loadVocabularyDeck(vocabularySeedDeck);
const quizQuestions = createQuizQuestions(vocabulary);

export function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [mode, setMode] = useState<'cards' | 'quiz'>('cards');
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizQuestionsAnswered, setQuizQuestionsAnswered] = useState(0);

  const currentCard = vocabulary[currentIndex];
  const currentQuestion = quizQuestions[currentIndex];
  const progress = useMemo(
    () => `${currentIndex + 1} of ${vocabulary.length}`,
    [currentIndex],
  );
  const isQuizMode = mode === 'quiz';

  function handleNextCard() {
    setShowDefinition(false);
    setCurrentIndex((index) => (index + 1) % vocabulary.length);
  }

  function handleNextQuestion() {
    setFeedback('');
    setSelectedAnswer('');
    setCurrentIndex((index) => (index + 1) % quizQuestions.length);
  }

  function handleModeChange(nextMode: 'cards' | 'quiz') {
    setMode(nextMode);
    setShowDefinition(false);
    setFeedback('');
    setSelectedAnswer('');
  }

  function handleQuizAnswer(answer: string) {
    if (selectedAnswer) {
      return;
    }

    const result = answerQuizQuestion(currentQuestion, answer);
    setSelectedAnswer(answer);
    setFeedback(result.feedback);
    setQuizQuestionsAnswered((count) => count + 1);
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

        <div className="mode-switch" aria-label="practice mode">
          <button
            type="button"
            className={!isQuizMode ? 'active-mode' : 'secondary'}
            onClick={() => handleModeChange('cards')}
          >
            Cards
          </button>
          <button
            type="button"
            className={isQuizMode ? 'active-mode' : 'secondary'}
            onClick={() => handleModeChange('quiz')}
          >
            Quiz mode
          </button>
        </div>

        <div className="hero-copy">
          <h1 id="app-title">
            {isQuizMode
              ? 'Practice English vocabulary with quiz questions.'
              : 'Practice English vocabulary with focused cards.'}
          </h1>
          <p>
            {isQuizMode
              ? 'Choose the definition that best matches each word, then review the feedback.'
              : 'Read the word, recall the meaning, then reveal the definition and example sentence.'}
          </p>
        </div>

        {isQuizMode ? (
          <>
            <article className="vocab-card quiz-card">
              <p className="card-label">Quiz question</p>
              <h2>{currentQuestion.prompt}</h2>
              <div className="answer-options">
                {currentQuestion.options.map((option) => (
                  <button
                    type="button"
                    className={
                      selectedAnswer === option ? 'selected-answer' : 'secondary'
                    }
                    disabled={Boolean(selectedAnswer)}
                    key={option}
                    onClick={() => handleQuizAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback ? (
                <p className="feedback" role="status">
                  {feedback}
                </p>
              ) : (
                <p className="prompt">Choose one answer.</p>
              )}
            </article>

            <div className="quiz-footer">
              <span
                className="progress"
                aria-label="quiz questions answered"
                data-testid="quiz-questions-answered"
              >
                {quizQuestionsAnswered}
              </span>
              <button
                type="button"
                className="secondary"
                disabled={!selectedAnswer}
                onClick={handleNextQuestion}
              >
                Next question
              </button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </section>
    </main>
  );
}
