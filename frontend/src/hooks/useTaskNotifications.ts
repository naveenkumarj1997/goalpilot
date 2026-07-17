import { useEffect, useRef } from 'react';

export const useTaskNotifications = (tasks: any[]) => {
  const notifiedTaskIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkTasks = async () => {
      // Check if notifications are supported and granted
      if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const now = new Date();
      // Adjust to local timezone ISO string for accurate comparison
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, -1);
      const todayStr = localISOTime.split('T')[0];
      
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      const dayOfWeek = now.getDay();

      tasks.forEach(async (task) => {
        if (!task.time) return;

        let isToday = false;
        if (!task.recurrence || task.recurrence.type === 'none') {
          isToday = task.date === todayStr;
        } else if (task.date <= todayStr) {
          if (task.recurrence.type === 'daily') isToday = true;
          if (task.recurrence.type === 'weekly' || task.recurrence.type === 'custom') {
            isToday = task.recurrence.daysOfWeek?.includes(dayOfWeek);
          }
        }

        if (!isToday) return;

        let isCompletedToday = false;
        if (task.recurrence?.type && task.recurrence.type !== 'none') {
          isCompletedToday = task.completedDates?.includes(todayStr);
        } else {
          isCompletedToday = task.completed;
        }

        if (isCompletedToday) return;

        if (task.time === currentTimeStr) {
          // Key includes today's date so recurring tasks notify again tomorrow
          const notificationKey = `${task._id}-${todayStr}`;
          
          if (!notifiedTaskIds.current.has(notificationKey)) {
            notifiedTaskIds.current.add(notificationKey);

            const formatTimeDisplay = (timeStr?: string | null) => {
              if (!timeStr) return '';
              const [h, m] = timeStr.split(':');
              const hour = parseInt(h, 10);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const hour12 = hour % 12 || 12;
              return `${hour12}:${m} ${ampm}`;
            };

            const title = task.title;
            const options = {
              body: task.endTime ? `${formatTimeDisplay(task.time)} - ${formatTimeDisplay(task.endTime)}` : formatTimeDisplay(task.time),
              icon: '/favicon.svg'
            };

            try {
              new Notification(title, options);
            } catch (err: any) {
              if (err.message && err.message.includes('Illegal constructor')) {
                try {
                  const registration = await navigator.serviceWorker.register('/sw.js');
                  await registration.showNotification(title, options);
                } catch (swErr) {
                  console.error('Service Worker notification failed:', swErr);
                }
              }
            }
          }
        }
      });
    };

    // Check immediately on mount or task update
    checkTasks();

    // Check every 30 seconds to ensure we hit the exact minute mark
    const interval = setInterval(checkTasks, 30000);

    return () => clearInterval(interval);
  }, [tasks]);
};
