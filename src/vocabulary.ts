export type VocabularyItem = {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  pronunciationHint: string;
};

export type QuizQuestion = {
  word: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
};

export type QuizAnswerResult = {
  isCorrect: boolean;
  feedback: string;
};

const requiredFields = [
  'word',
  'partOfSpeech',
  'definition',
  'exampleSentence',
  'pronunciationHint',
] satisfies Array<keyof VocabularyItem>;

export const vocabularySeedDeck: VocabularyItem[] = [
  {
    word: 'resilient',
    partOfSpeech: 'adjective',
    definition: 'Able to recover quickly after difficulty or change.',
    exampleSentence: 'A resilient learner tries again after a difficult quiz.',
    pronunciationHint: 'ri-ZIL-yent',
  },
  {
    word: 'curious',
    partOfSpeech: 'adjective',
    definition: 'Eager to learn, ask questions, and discover new ideas.',
    exampleSentence: 'Curious students notice patterns in new vocabulary.',
    pronunciationHint: 'KYUR-ee-us',
  },
  {
    word: 'precise',
    partOfSpeech: 'adjective',
    definition: 'Exact, careful, and clearly expressed.',
    exampleSentence: 'A precise sentence uses the best word for the meaning.',
    pronunciationHint: 'pri-SISE',
  },
  {
    word: 'meticulous',
    partOfSpeech: 'adjective',
    definition: 'Showing great attention to detail.',
    exampleSentence: 'The editor made a meticulous review of every paragraph.',
    pronunciationHint: 'muh-TIK-yuh-lus',
  },
  {
    word: 'adapt',
    partOfSpeech: 'verb',
    definition: 'To change for a new situation or purpose.',
    exampleSentence: 'Writers adapt their tone for different readers.',
    pronunciationHint: 'uh-DAPT',
  },
  {
    word: 'collaborate',
    partOfSpeech: 'verb',
    definition: 'To work together with others toward a shared goal.',
    exampleSentence: 'The group collaborated on a clear presentation.',
    pronunciationHint: 'kuh-LAB-uh-rayt',
  },
  {
    word: 'evidence',
    partOfSpeech: 'noun',
    definition: 'Information or facts that support a conclusion.',
    exampleSentence: 'The scientist collected evidence before making a claim.',
    pronunciationHint: 'EV-uh-dens',
  },
  {
    word: 'infer',
    partOfSpeech: 'verb',
    definition: 'To reach an idea by using facts and reasoning.',
    exampleSentence: 'Readers infer a character’s feelings from their actions.',
    pronunciationHint: 'in-FUR',
  },
  {
    word: 'contrast',
    partOfSpeech: 'verb',
    definition: 'To compare things in order to show their differences.',
    exampleSentence: 'The essay contrasts city life with country life.',
    pronunciationHint: 'kun-TRAST',
  },
  {
    word: 'summarize',
    partOfSpeech: 'verb',
    definition: 'To state the main ideas in a short form.',
    exampleSentence: 'Please summarize the article in three sentences.',
    pronunciationHint: 'SUM-uh-rize',
  },
  {
    word: 'analyze',
    partOfSpeech: 'verb',
    definition: 'To study something carefully by looking at its parts.',
    exampleSentence: 'Students analyze the poem before discussing its theme.',
    pronunciationHint: 'AN-uh-lize',
  },
  {
    word: 'context',
    partOfSpeech: 'noun',
    definition: 'The situation or surrounding words that help explain meaning.',
    exampleSentence: 'The context helped Mia understand the unfamiliar phrase.',
    pronunciationHint: 'KON-tekst',
  },
  {
    word: 'fluent',
    partOfSpeech: 'adjective',
    definition: 'Able to speak, read, or write smoothly and easily.',
    exampleSentence: 'Daily practice helped Omar become a fluent speaker.',
    pronunciationHint: 'FLOO-ent',
  },
  {
    word: 'coherent',
    partOfSpeech: 'adjective',
    definition: 'Clear, logical, and easy to understand.',
    exampleSentence: 'Her coherent explanation helped the class follow the steps.',
    pronunciationHint: 'koh-HEER-ent',
  },
  {
    word: 'evaluate',
    partOfSpeech: 'verb',
    definition: 'To judge the value, quality, or importance of something.',
    exampleSentence: 'The team evaluated each idea before choosing a plan.',
    pronunciationHint: 'ih-VAL-yoo-ayt',
  },
  {
    word: 'interpret',
    partOfSpeech: 'verb',
    definition: 'To explain the meaning of information, words, or actions.',
    exampleSentence: 'Different readers may interpret the ending differently.',
    pronunciationHint: 'in-TUR-prit',
  },
  {
    word: 'justify',
    partOfSpeech: 'verb',
    definition: 'To give reasons or evidence for a choice or opinion.',
    exampleSentence: 'Use details from the text to justify your answer.',
    pronunciationHint: 'JUS-tuh-fy',
  },
  {
    word: 'relevant',
    partOfSpeech: 'adjective',
    definition: 'Closely connected to the topic or task.',
    exampleSentence: 'She chose relevant examples for her speech.',
    pronunciationHint: 'REL-uh-vunt',
  },
  {
    word: 'strategy',
    partOfSpeech: 'noun',
    definition: 'A planned way to reach a goal.',
    exampleSentence: 'His reading strategy was to preview headings first.',
    pronunciationHint: 'STRAT-uh-jee',
  },
  {
    word: 'articulate',
    partOfSpeech: 'verb',
    definition: 'To express an idea clearly in words.',
    exampleSentence: 'Nina articulated her opinion with confidence.',
    pronunciationHint: 'ar-TIK-yuh-layt',
  },
];

export function loadVocabularyDeck(deck: VocabularyItem[]): VocabularyItem[] {
  const seenWords = new Set<string>();

  deck.forEach((item, index) => {
    requiredFields.forEach((field) => {
      if (item[field].trim().length === 0) {
        throw new Error(`Vocabulary item ${index + 1} is missing ${field}.`);
      }
    });

    const normalizedWord = normalizeWord(item.word);
    if (seenWords.has(normalizedWord)) {
      throw new Error(`Vocabulary deck contains duplicate word: ${item.word}.`);
    }

    seenWords.add(normalizedWord);
  });

  return deck;
}

export function findVocabularyWord(
  deck: VocabularyItem[],
  word: string,
): VocabularyItem | undefined {
  const normalizedQuery = normalizeWord(word);

  return deck.find((item) => normalizeWord(item.word) === normalizedQuery);
}

export function createQuizQuestions(deck: VocabularyItem[]): QuizQuestion[] {
  const loadedDeck = loadVocabularyDeck(deck);

  return loadedDeck.map((item, index) => {
    const distractors = loadedDeck
      .filter((option) => normalizeWord(option.word) !== normalizeWord(item.word))
      .slice(index, index + 3);
    const wrappedDistractors =
      distractors.length === 3
        ? distractors
        : [
            ...distractors,
            ...loadedDeck
              .filter(
                (option) =>
                  normalizeWord(option.word) !== normalizeWord(item.word) &&
                  !distractors.includes(option),
              )
              .slice(0, 3 - distractors.length),
          ];

    return {
      word: item.word,
      prompt: `What does "${item.word}" mean?`,
      options: [item.definition, ...wrappedDistractors.map((option) => option.definition)],
      correctAnswer: item.definition,
    };
  });
}

export function answerQuizQuestion(
  question: QuizQuestion,
  selectedAnswer: string,
): QuizAnswerResult {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const prefix = isCorrect ? 'Correct.' : 'Not quite.';

  return {
    isCorrect,
    feedback: `${prefix} ${question.word} means: ${question.correctAnswer}`,
  };
}

function normalizeWord(word: string) {
  return word.trim().toLocaleLowerCase('en-US');
}
