import BrainFlashcard from '../models/BrainFlashcard';

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * @param quality 0-5 score of how well the user remembered
 * @param easeFactor Current ease factor
 * @param interval Current interval in days
 * @param repetitions Number of times correctly recalled in a row
 */
export const calculateSRS = (
  quality: number,
  easeFactor: number,
  interval: number,
  repetitions: number
) => {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newRepetitions = repetitions;
  let newInterval = interval;

  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions++;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  };
};

/**
 * Programmatic cloze-deletion flashcard generator
 * Takes a block of text and creates fill-in-the-blank cards based on keywords.
 */
export const generateProgrammaticFlashcards = (text: string): { front: string; back: string }[] => {
  const cards: { front: string; back: string }[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  // Basic heuristic: find capitalized words, numbers, or terms in quotes
  const keywordRegex = /"([^"]+)"|\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b|\b(\d+)\b/g;

  sentences.forEach((sentence) => {
    if (sentence.length < 15) return;
    
    let match;
    const keywords = [];
    // Need a fresh regex instance or reset lastIndex if global
    const regex = new RegExp(keywordRegex);
    
    while ((match = regex.exec(sentence)) !== null) {
      const word = match[1] || match[2] || match[3];
      // Skip very common first words of sentences if they are just basic grammar
      if (word && word.length > 3 && !['The', 'This', 'That', 'These', 'Those', 'They', 'When', 'What', 'Where', 'Why', 'How'].includes(word)) {
        keywords.push(word);
      }
    }

    if (keywords.length > 0) {
      // Create a card for the most prominent keyword (or randomly select one)
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      const front = sentence.replace(keyword, '___');
      cards.push({ front, back: keyword });
    }
  });

  return cards;
};
