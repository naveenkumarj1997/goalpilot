self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body || 'You have a new notification.',
        icon: data.icon || '/vite.svg',
        badge: '/vite.svg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'GoalPilot', options)
      );
    } catch (err) {
      console.error('Push event data was not JSON:', err);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Attempt to open the web app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
