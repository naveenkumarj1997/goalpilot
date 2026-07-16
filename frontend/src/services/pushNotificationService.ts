import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

const VAPID_PUBLIC_KEY = 'BO38oDaARDCR1BVssxNuVngF5S6LZDMTlGmUetKQFte6Aq8oH1XipufJVhLNea4r_Rj7j14ZnlI9l4E6WtyGwGY';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let isSubscribing = false;

export const subscribeToPushNotifications = async (token: string) => {
  if (isSubscribing) return;
  isSubscribing = true;

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications are not supported by the browser.');
    isSubscribing = false;
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered for Push Notifications');

    // Check if permission is already granted or request it
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Push notification permission denied.');
      isSubscribing = false;
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Send subscription to backend
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.post(`${API_URL}/notifications/subscribe`, { subscription, timezone }, config);
    console.log('Push subscription successfully sent to backend.');
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  } finally {
    isSubscribing = false;
  }
};
