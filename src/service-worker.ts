/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare global {
  interface WorkerNavigator {
    setAppBadge: (contents?: number) => Promise<void>;
    clearAppBadge: () => Promise<void>;
  }
}

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

const sendLog = async (message: string) => {
  console.info(message);
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });

  clients.forEach(client => {
    client.postMessage({
      type: 'LOG',
      message
    });
  });
};

const showBadge = (count: number): Promise<void> => {
  if ('setAppBadge' in self.navigator) {
    return self.navigator.setAppBadge(count);
  }
  return Promise.resolve();
};

let subscription: PushSubscription;

const registerPush = async () => {
  if ('pushManager' in self.registration && typeof self.registration.pushManager.subscribe === 'function') {
    await sendLog('Registering a push subscription');
    try {
      subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_KEY
      });
      await sendLog(`${JSON.stringify(subscription.toJSON(), null, 2)}`);
    } catch (e) {
      await sendLog(`Unable to subscribe. ${e}`);
    }
  }
};

const showNotification = async () => {
  if (Notification.permission !== 'granted') {
    sendLog('No permission to show notifications');
    return;
  }

  try {
    await self.registration.showNotification('Test Notification', {
      body: 'You should feel vibrations',
      icon: './icon.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    });
    sendLog('Test notification is sent successfully');
  } catch (e) {
    sendLog(`Error sending test notification: ${e}`);
  }
};

const requestPush = async () => {
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

self.addEventListener('message', (event) => {
  sendLog(`${event.data.type} event received by service worker`);
  if (event.data && event.data.type === 'SEND_NOTIFICATION') {
    const promises: Promise<unknown>[] = [];

    promises.push(showNotification());

    if ('setAppBadge' in self.navigator) {
      promises.push(self.navigator.setAppBadge(1));
    }

    event.waitUntil(Promise.all(promises));
  }

  if (event.data && event.data.type === 'REQUEST_PUSH') {
    event.waitUntil(requestPush());
  }
});

self.addEventListener('push', (event) => {
  sendLog(`Got push message: ${JSON.stringify(event.data?.json() || {}, null, 2)}`);

  const promises: Promise<unknown>[] = [];

  const badgePromise = showBadge(1);
  promises.push(badgePromise);

  const { title = 'Empty message', body = 'Empty message' } = event.data?.json() || {};
  const notificationPromise = self.registration.showNotification(title, { body });
  promises.push(notificationPromise);

  const all = Promise.all(promises).catch(e => sendLog(`Push processing failed. ${e}`));

  event.waitUntil(all);
});

sendLog('Initializing');
registerPush();
