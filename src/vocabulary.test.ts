import { describe, expect, it } from 'vitest';
import {
  answerQuizQuestion,
  createQuizQuestions,
  findVocabularyWord,
  loadVocabularyDeck,
  vocabularySeedDeck,
} from './vocabulary';

describe('vocabulary deck', () => {
  it('loads a valid seed deck with at least 20 structured words', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);

    expect(deck).toHaveLength(20);
    expect(deck.length).toBeGreaterThanOrEqual(20);
    expect(deck[0]).toEqual({
      word: 'resilient',
      partOfSpeech: 'adjective',
      definition: 'Able to recover quickly after difficulty or change.',
      exampleSentence: 'A resilient learner tries again after a difficult quiz.',
      pronunciationHint: 'ri-ZIL-yent',
    });
    expect(
      deck.every(
        (item) =>
          item.word.length > 0 &&
          item.partOfSpeech.length > 0 &&
          item.definition.length > 0 &&
          item.exampleSentence.length > 0 &&
          item.pronunciationHint.length > 0,
      ),
    ).toBe(true);
  });

  it('detects invalid deck items with missing required fields', () => {
    expect(() =>
      loadVocabularyDeck([
        {
          word: 'fragment',
          partOfSpeech: 'noun',
          definition: 'A small part broken off from something.',
          exampleSentence: '',
          pronunciationHint: 'FRAG-ment',
        },
      ]),
    ).toThrow(/exampleSentence/i);
  });

  it('detects duplicate words in a deck', () => {
    expect(() =>
      loadVocabularyDeck([
        {
          word: 'adapt',
          partOfSpeech: 'verb',
          definition: 'To change for a new situation.',
          exampleSentence: 'Writers adapt their tone for different readers.',
          pronunciationHint: 'uh-DAPT',
        },
        {
          word: 'Adapt',
          partOfSpeech: 'verb',
          definition: 'To adjust to new conditions.',
          exampleSentence: 'Teams adapt when project requirements change.',
          pronunciationHint: 'uh-DAPT',
        },
      ]),
    ).toThrow(/duplicate/i);
  });

  it('looks up words without requiring exact casing', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);

    expect(findVocabularyWord(deck, 'METICULOUS')).toMatchObject({
      word: 'meticulous',
      partOfSpeech: 'adjective',
    });
    expect(findVocabularyWord(deck, 'unknown')).toBeUndefined();
  });
});

describe('quiz generation', () => {
  it('generates multiple-choice options with exactly one correct answer', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);
    const [question] = createQuizQuestions(deck);

    expect(question.prompt).toBe('What does "resilient" mean?');
    expect(question.correctAnswer).toBe(
      'Able to recover quickly after difficulty or change.',
    );
    expect(question.options).toHaveLength(4);
    expect(new Set(question.options).size).toBe(4);
    expect(question.options).toContain(question.correctAnswer);
    expect(
      question.options.filter((option) => option === question.correctAnswer),
    ).toHaveLength(1);
  });

  it('keeps the correct answer attached to the selected vocabulary item', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);
    const questions = createQuizQuestions(deck);

    expect(questions[1]).toMatchObject({
      word: 'curious',
      correctAnswer: 'Eager to learn, ask questions, and discover new ideas.',
    });
  });

  it('returns positive feedback for a correct answer', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);
    const [question] = createQuizQuestions(deck);

    expect(answerQuizQuestion(question, question.correctAnswer)).toEqual({
      isCorrect: true,
      feedback: 'Correct. resilient means: Able to recover quickly after difficulty or change.',
    });
  });

  it('returns corrective feedback for an incorrect answer', () => {
    const deck = loadVocabularyDeck(vocabularySeedDeck);
    const [question] = createQuizQuestions(deck);
    const incorrectOption = question.options.find(
      (option) => option !== question.correctAnswer,
    );

    expect(answerQuizQuestion(question, incorrectOption ?? '')).toEqual({
      isCorrect: false,
      feedback: 'Not quite. resilient means: Able to recover quickly after difficulty or change.',
    });
  });
});
