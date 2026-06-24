// Fully offline, no-AI market analysis using keyword algorithms

const basicSentimentAnalysis = (text: string) => {
  const t = text.toLowerCase();
  const bullishWords = ['growth', 'profit', 'up', 'surge', 'jump', 'gain', 'beat', 'record', 'boom', 'bull', 'rally'];
  const bearishWords = ['loss', 'down', 'drop', 'plunge', 'fall', 'miss', 'layoff', 'crash', 'recession', 'bear', 'warning'];

  let bullScore = 0;
  let bearScore = 0;

  bullishWords.forEach(w => { if (t.includes(w)) bullScore++; });
  bearishWords.forEach(w => { if (t.includes(w)) bearScore++; });

  if (bullScore > bearScore) return 'Bullish' as const;
  if (bearScore > bullScore) return 'Bearish' as const;
  return 'Neutral' as const;
};

export const analyzeNews = async (title: string, summary: string) => {
  const textToAnalyze = `Title: ${title}\nSummary: ${summary}`;
  
  return {
    aiSummary: summary, // Use original summary
    whyItMatters: 'Extracted via Keyword Algorithm. Read the full article for deep analysis.',
    risks: 'Standard market risks apply. Always do your own research.',
    opportunities: 'Look for volume trends in related sectors.',
    sentiment: basicSentimentAnalysis(textToAnalyze),
    confidenceLevel: 80,
    aiProcessed: false // Flag to show it was an algorithmic check
  };
};

export const getAIExplanation = async (question: string) => {
  const q = question.toLowerCase();
  if (q.includes('bull')) return "A 'Bull Market' happens when investment prices are rising or are expected to rise. Investors are optimistic.";
  if (q.includes('bear')) return "A 'Bear Market' happens when prices fall 20% or more from recent highs. Investors are pessimistic.";
  if (q.includes('inflation')) return "Inflation is the rate at which the general level of prices for goods and services is rising, decreasing purchasing power.";
  if (q.includes('dividend')) return "A dividend is a distribution of a portion of a company's earnings to its shareholders.";
  if (q.includes('etf')) return "An ETF (Exchange Traded Fund) is a basket of securities that trades on an exchange just like a stock.";
  if (q.includes('interest rate')) return "Interest rates are set by Central Banks. Higher rates usually cool down the economy and tech stocks, while lower rates stimulate borrowing and growth.";

  return "I am currently in Offline Mode. Try asking about basic terms like 'Bull Market', 'Bear Market', 'Inflation', 'ETF', or 'Dividend'. *Disclaimer: Educational purposes only.*";
};
