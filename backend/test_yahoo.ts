import yahooFinance from 'yahoo-finance2';

async function run() {
  try {
    console.log('Testing ^GSPC...');
    const quote = await yahooFinance.quote('^GSPC');
    console.log('Quote for ^GSPC:', quote.regularMarketPrice);
  } catch (err: any) {
    console.error('Yahoo Finance Error:', err.message);
  }
}

run();
