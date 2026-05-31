import { describe, expect, it } from 'vitest';
import {
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
