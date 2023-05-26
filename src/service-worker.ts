/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

console.info(`Service worker build ${import.meta.env.VITE_BUILD || 'unknown'}`);

/** METHODS **/

const send = async (type: string, message?: string) => {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });

  // console.log(clients);

  clients.forEach(client => {
    client.postMessage({
      type: 'LOG',
      message
    });
  });
};

const sendLog =  (message: string) => {
  console.info(message);
  return send('LOG', message)
};

const showBadge = (count: number): Promise<void> => {
  if ('setAppBadge' in self.navigator) {
    return self.navigator.setAppBadge(count).then(() => sendLog('Badge displayed'));
  }
  sendLog('Badge API is not available');
  return Promise.resolve();
};

const registerPushSubscription = async (): Promise<PushSubscription | null> => {
  if ('pushManager' in self.registration && typeof self.registration.pushManager.subscribe === 'function') {
    await sendLog('Registering a push subscription');
    try {
      const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_KEY
      });
      await sendLog(`Subscribed successfully`);
      await send('SUB');
      return subscription;
    } catch (e) {
      await sendLog(`Unable to subscribe. ${e}`);
    }
  }
  return null;
};

const showNotification = async () => {
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

const requestPush = async (subscription: PushSubscription) => {
  const result = await fetch(import.meta.env.VITE_PUSH_URL, {
    method: 'post',
    body: JSON.stringify(subscription, null, 2),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const message = await result.text();
  await sendLog(`Push request result: ${message}`);
};

/** INSTALLATION **/

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

/** VARIABLES **/

let subscription: PushSubscription | null = null;

/** STARTUP **/

(async () => {
  sendLog('Service worker is running');
  subscription = await registerPushSubscription();
})();

/** EVENT HANDLERS **/

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SEND_NOTIFICATION') {
    const promises: Promise<unknown>[] = [];

    promises.push(showNotification());

    if ('setAppBadge' in self.navigator) {
      promises.push(self.navigator.setAppBadge(1));
    }

    event.waitUntil(Promise.all(promises));
  }

  if (event.data?.type === 'REQUEST_PUSH') {
    if (subscription) {
      event.waitUntil(requestPush(subscription));
    } else {
      event.waitUntil(sendLog('Unable to request a push: no subscription'));
    }
  }

  if (event.data?.type === 'APP_OPEN') {
    if ('clearAppBadge' in self.navigator) {
      event.waitUntil(self.navigator.clearAppBadge());
    }
  }
});

self.addEventListener('push', (event) => {
  sendLog('Received a push message');

  const promises: Promise<unknown>[] = [];

  const badgePromise = showBadge(1);
  promises.push(badgePromise);

  const { title = 'Empty message', body = 'Empty message' } = event.data?.json() || {};
  const notificationPromise = self.registration.showNotification(title, { body });
  promises.push(notificationPromise);

  const all = Promise.all(promises).catch(e => sendLog(`Push processing failed. ${e}`));

  event.waitUntil(all);
});

