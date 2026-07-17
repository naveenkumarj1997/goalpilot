import webpush from 'web-push';
import DailyPlan from '../models/DailyPlan';
import TickTickTask from '../models/TickTickTask';
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
    
    // Target time is exactly 0 minutes from now (trigger AT the exact time)
    const targetTime = today;

    // We will do a generic approach: iterate over users with subscriptions
    const usersWithSubs = await User.find({ pushSubscription: { $ne: null } });

    for (const user of usersWithSubs) {
      if (!user.pushSubscription) continue;

      const userTz = user.timezone || 'Asia/Kolkata';
      
      const dateOptions: Intl.DateTimeFormatOptions = { 
        timeZone: userTz, 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      };
      
      const formatter = new Intl.DateTimeFormat('en-CA', dateOptions);
      const parts = formatter.formatToParts(targetTime);
      
      let year, month, day, hour, minute;
      for (const part of parts) {
        if (part.type === 'year') year = part.value;
        if (part.type === 'month') month = part.value;
        if (part.type === 'day') day = part.value;
        if (part.type === 'hour') hour = part.value;
        if (part.type === 'minute') minute = part.value;
      }

      const todayStr = `${year}-${month}-${day}`;
      const formattedTargetTime = `${hour}:${minute}`;

      const userDateStr = targetTime.toLocaleString("en-US", {timeZone: userTz});
      const userLocalObj = new Date(userDateStr);
      const dayOfWeek = userLocalObj.getDay();

      const notificationsToSend: { title: string, body: string }[] = [];

      // 1. Check DailyPlan Tasks
      const plans = await DailyPlan.find({ date: todayStr, user: user._id });
      for (const plan of plans) {
        const upcomingTasks = plan.tasks.filter((t: any) => t.startTime === formattedTargetTime && !t.completed);
        for (const task of upcomingTasks) {
          notificationsToSend.push({
            title: `Mission Starts Now!`,
            body: `"${task.title}" is scheduled for ${formatTimeDisplay(task.startTime)}.`
          });
        }
      }

      // 2. Check TickTick Tasks
      const ttTasks = await TickTickTask.find({ user: user._id, completed: false, time: formattedTargetTime });
      for (const task of ttTasks) {
        let isToday = false;
        if (!task.recurrence || task.recurrence.type === 'none') {
          isToday = task.date === todayStr;
        } else if (task.date && task.date <= todayStr) {
          if (task.recurrence.type === 'daily') isToday = true;
          if (task.recurrence.type === 'weekly' || task.recurrence.type === 'custom') {
            isToday = (task.recurrence.daysOfWeek || []).includes(dayOfWeek);
          }
        }

        if (!isToday) continue;

        let isCompletedToday = false;
        if (task.recurrence?.type && task.recurrence.type !== 'none') {
          isCompletedToday = (task.completedDates || []).includes(todayStr);
        } else {
          isCompletedToday = task.completed;
        }

        if (!isCompletedToday) {
          notificationsToSend.push({
            title: `Task Reminder: ${task.title}`,
            body: task.folder && task.folder !== 'Inbox' ? `Folder: ${task.folder}` : 'Time to get started!'
          });
        }
      }

      // Send all collected notifications for this user
      for (const notif of notificationsToSend) {
        const payload = JSON.stringify({
          title: notif.title,
          body: notif.body,
          icon: '/favicon.svg'
        });

        try {
          await webpush.sendNotification(user.pushSubscription, payload);
          console.log(`[PUSH] Sent notification to ${user.email} for: ${notif.title}`);
        } catch (error: any) {
          console.error(`[PUSH] Failed to send to ${user.email}:`, error.message);
          if (error.statusCode === 410 || error.statusCode === 404) {
             await User.findByIdAndUpdate(user._id, { pushSubscription: null });
             break; // Stop sending to this user if subscription is dead
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
