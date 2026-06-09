import cron from 'node-cron';
import { runScrapers } from './scraperService';
import Message from '../models/Message';

let cronTask: any = null;

export const initCronJobs = () => {
  console.log('Initializing Job Discovery Cron...');

  // Run every 30 minutes
  cronTask = cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Starting scheduled job discovery scan...');
    try {
      await runScrapers();
      console.log('[CRON] Scheduled job discovery scan completed successfully.');
    } catch (error) {
      console.error('[CRON] Error during job discovery scan:', error);
    }
  });

  // Run at midnight every day
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting daily chat cleanup...');
    try {
      const result = await Message.deleteMany({});
      console.log(`[CRON] Daily chat cleanup completed. Deleted ${result.deletedCount} messages.`);
    } catch (error) {
      console.error('[CRON] Error during daily chat cleanup:', error);
    }
  });
};

export const triggerManualScan = async () => {
  console.log('[MANUAL] Triggering manual job discovery scan...');
  await runScrapers();
};
