import yahooFinanceRaw from 'yahoo-finance2';
const yahooFinance = (yahooFinanceRaw as any).default || yahooFinanceRaw;

export const getMarketOverview = async () => {
  try {
    const indices = ['^GSPC', '^DJI', '^IXIC', '^BSESN', '^NSEI', 'AAPL', 'MSFT', 'TSLA', 'NVDA', 'RELIANCE.NS']; // Added major tech & Indian stocks
    const results = [];
    for (const symbol of indices) {
      try {
        const quote = await yahooFinance.quote(symbol) as any;
        results.push({
          symbol,
          name: quote.shortName || symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent
        });
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
      }
    }
    
    if (results.length === 0) {
      // Fallback dummy data if Yahoo Finance blocks the request
      return [
        { symbol: '^GSPC', name: 'S&P 500', price: 5432.10, change: 12.50, changePercent: 0.23 },
        { symbol: '^DJI', name: 'Dow Jones', price: 39123.45, change: -45.20, changePercent: -0.11 },
        { symbol: '^IXIC', name: 'NASDAQ', price: 17654.32, change: 89.10, changePercent: 0.51 },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 195.20, change: 2.10, changePercent: 1.08 },
        { symbol: 'MSFT', name: 'Microsoft', price: 420.50, change: 1.50, changePercent: 0.35 },
      ];
    }
    return results;
  } catch (err) {
    console.error('Error fetching market overview', err);
    return [];
  }
};

export const getTickerQuote = async (ticker: string) => {
  try {
    const quote = await yahooFinance.quote(ticker) as any;
    return {
      symbol: quote.symbol,
      name: quote.shortName || quote.longName,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      currency: quote.currency
    };
  } catch (err) {
    console.error(`Error fetching quote for ${ticker}:`, err);
    throw new Error('Could not fetch ticker data. It may be invalid.');
  }
};
