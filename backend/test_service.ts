import { getMarketOverview } from './src/services/marketDataService';

async function run() {
  const result = await getMarketOverview();
  console.log('Result:', result);
}

run();
