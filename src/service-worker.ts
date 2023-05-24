/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerPushSubscription, sendLog, showNotification, requestPush, showBadge } from './service-worker.utils';

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

let subscription: PushSubscription | null = null;

self.addEventListener('activate', async () => {
  sendLog('Sevice worker is active');
  subscription = await registerPushSubscription();
});


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
    if (subscription) {
      event.waitUntil(requestPush(subscription));
    } else {
      event.waitUntil(sendLog('Unable to request a push: no subscription'));
    }
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
