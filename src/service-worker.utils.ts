declare const self: ServiceWorkerGlobalScope;

export const sendLog = async (message: string) => {
  console.info(message);
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });

  clients.forEach(client => {
    client.postMessage({
      type: 'LOG',
      message
    });
  });
};

export const showBadge = (count: number): Promise<void> => {
  if ('setAppBadge' in self.navigator) {
    return self.navigator.setAppBadge(count);
  }
  sendLog('Badge API is not available');
  return Promise.resolve();
};

export const registerPushSubscription = async (): Promise<PushSubscription | null> => {
  if ('pushManager' in self.registration && typeof self.registration.pushManager.subscribe === 'function') {
    await sendLog('Registering a push subscription');
    try {
      const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_KEY
      });
      await sendLog(`Subscribed successfully`);
      return subscription;
    } catch (e) {
      await sendLog(`Unable to subscribe. ${e}`);
    }
  }
  return null;
};

export const showNotification = async () => {
  if (Notification.permission !== 'granted') {
    sendLog('No permission to show notifications');
    return;
  }

  try {
    await self.registration.showNotification('Local Notification', {
      body: 'This was sent from service worker, without using Push API',
      icon: './icon-192.png',
    });
    sendLog('Local notification is sent successfully');
  } catch (e) {
    sendLog(`Error sending local notification: ${e}`);
  }
};

export const requestPush = async (subscription: PushSubscription) => {
  const result = await fetch('https://rockstar-push.glitch.me/send-push', {
    method: 'post',
    body: JSON.stringify(subscription, null, 2),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const message = await result.text();
  await sendLog(`Push request result: ${message}`);
};
