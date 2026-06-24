import cron from 'node-cron';
import { runScrapers } from './scraperService';
import Message from '../models/Message';
import { checkAndSendUpcomingTaskNotifications } from './pushNotificationService';
import { aggregateIntelligence, cleanupOldIntelligence } from './intelligenceAggregator';

let cronTask: any = null;

export const initCronJobs = () => {
  console.log('Initializing Cron Jobs...');

  // Run every minute for push notifications
  cron.schedule('* * * * *', async () => {
    await checkAndSendUpcomingTaskNotifications();
  });

  // Run every 30 minutes
  cronTask = cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Starting scheduled job discovery & intelligence scan...');
    try {
      await runScrapers();
      await aggregateIntelligence();
      console.log('[CRON] Scheduled scans completed successfully.');
    } catch (error) {
      console.error('[CRON] Error during scans:', error);
    }
  });

  // Run every 2 hours for Market Intelligence (Heavier AI workload)
  cron.schedule('0 */2 * * *', async () => {
    console.log('[CRON] Starting Market Intelligence scan...');
    try {
      const { aggregateMarketNews } = await import('./marketAggregator');
      await aggregateMarketNews();
    } catch (error) {
      console.error('[CRON] Error during market scans:', error);
    }
  });

  // Run at midnight every day
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting daily cleanup tasks...');
    try {
      const result = await Message.deleteMany({});
      console.log(`[CRON] Daily chat cleanup completed. Deleted ${result.deletedCount} messages.`);
      
      await cleanupOldIntelligence();
    } catch (error) {
      console.error('[CRON] Error during daily cleanup:', error);
    }
  });
};

export const triggerManualScan = async () => {
  console.log('[MANUAL] Triggering manual job discovery scan...');
  await runScrapers();
};
