export type IQRank = {
  title: string;
  percentile: string;
  color: string;
  message: string;
};

export const getIQRank = (gameId: string, score: number): IQRank => {
  const RANKS = [
    { threshold: 0.9, title: "Genius Level", percentile: "Top 1%", color: "text-fuchsia-400", message: "Elite cognitive abilities detected." },
    { threshold: 0.7, title: "Highly Gifted", percentile: "Top 5%", color: "text-purple-400", message: "Exceptional performance, well above average." },
    { threshold: 0.4, title: "Above Average", percentile: "Top 20%", color: "text-blue-400", message: "Great job! Your brain is firing fast." },
    { threshold: 0.2, title: "Average", percentile: "Top 50%", color: "text-emerald-400", message: "Solid baseline performance. Keep training!" },
    { threshold: 0.0, title: "Novice", percentile: "Bottom 50%", color: "text-slate-400", message: "Just getting started. Consistent training builds neural paths." }
  ];

  let ratio = 0;

  switch (gameId) {
    case 'chimp':
      // Score = level * 100 * multiplier (up to 3x).
      // Level 10 on hard = 3000. Sum of 1..10 = 55. 55 * 100 * 3 = 16500.
      ratio = Math.min(score / 12000, 1.0); 
      break;
    case 'spatial':
      // Score = level * 150 * multiplier. 
      ratio = Math.min(score / 8000, 1.0);
      break;
    case 'stroop':
      // 100 per correct * 3 = 300. 15 correct = 4500.
      ratio = Math.min(score / 4000, 1.0);
      break;
    case 'reaction':
      // Unchanged as it doesn't use multiplier.
      if (score === 0 || score > 1000) ratio = 0.1;
      else if (score <= 200) ratio = 0.95; // Genius
      else if (score <= 250) ratio = 0.75; // Highly Gifted
      else if (score <= 300) ratio = 0.55; // Above Avg
      else if (score <= 400) ratio = 0.35; // Average
      else ratio = 0.1; // Novice
      break;
    case 'pattern':
    case 'odd':
    case 'logic':
    case 'matrix':
      // ~100-150 per correct * 3 = 300-450 per correct. 10 correct = 3000-4500.
      ratio = Math.min(score / 3000, 1.0);
      break;
    case 'flash':
    case 'face':
    case 'reframe':
    case 'focus':
      ratio = Math.min(score / 3000, 1.0); // Default for new games
      break;
    default:
      ratio = 0;
  }

  for (const rank of RANKS) {
    if (ratio >= rank.threshold) return rank;
  }
  
  return RANKS[RANKS.length - 1];
};
