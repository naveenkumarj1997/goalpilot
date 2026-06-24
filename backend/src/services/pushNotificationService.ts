import webpush from 'web-push';
import DailyPlan from '../models/DailyPlan';
import User from '../models/User';

let isInitialized = false;

const initWebPush = () => {
  if (isInitialized) return;
  if (!process.env.VAPID_PUBLIC_KEY) {
    console.warn('[PUSH] VAPID keys not found in .env. Push notifications will not work.');
    return;
  }
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:test@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY || ''
  );
  isInitialized = true;
};

export const checkAndSendUpcomingTaskNotifications = async () => {
  try {
    initWebPush();
    
    if (!isInitialized) return;

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Target time is exactly 5 minutes from now
    const targetTime = new Date(today.getTime() + 5 * 60000);
    const targetHours = targetTime.getHours();
    const targetMinutes = targetTime.getMinutes();
    const formattedTargetTime = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;

    console.log(`[PUSH CRON] Running at ${today.toLocaleTimeString()} | Target: ${formattedTargetTime} | Date: ${dateStr}`);

    // Find all daily plans for today
    const plans = await DailyPlan.find({ date: dateStr }).populate('user');

    for (const plan of plans) {
      const user = plan.user as any;
      if (!user || !user.pushSubscription) continue;

      // Find tasks that start EXACTLY at formattedTargetTime
      const upcomingTasks = plan.tasks.filter((t: any) => t.startTime === formattedTargetTime && !t.completed);

      if (upcomingTasks.length > 0) {
        console.log(`[PUSH] Found ${upcomingTasks.length} tasks for ${user.email} at ${formattedTargetTime}`);
      }

      for (const task of upcomingTasks) {
        const payload = JSON.stringify({
          title: `Mission Starts in 5 Minutes!`,
          body: `"${task.title}" is scheduled for ${formatTimeDisplay(task.startTime)}. Get ready!`,
          icon: '/android-chrome-192x192.png'
        });

        try {
          await webpush.sendNotification(user.pushSubscription, payload);
          console.log(`[PUSH] Sent notification to ${user.email} for task: ${task.title}`);
        } catch (error: any) {
          console.error(`[PUSH] Failed to send to ${user.email}:`, error.message);
          if (error.statusCode === 410 || error.statusCode === 404) {
             await User.findByIdAndUpdate(user._id, { pushSubscription: null });
          }
        }
      }
    }
  } catch (error) {
    console.error('[PUSH CRON] Error checking upcoming tasks:', error);
  }
};

const formatTimeDisplay = (timeStr?: string | null) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};
