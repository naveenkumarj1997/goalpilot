self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new GoalPilot notification!',
    icon: '/favicon.svg',
    badge: '/favicon.svg'
  };
  event.waitUntil(
    self.registration.showNotification('GoalPilot', options)
  );
});
