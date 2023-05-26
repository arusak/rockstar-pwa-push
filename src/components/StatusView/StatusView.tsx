import React, { FC, useEffect, useState } from 'react';

import s from './StatusView.module.css';
import { Check } from 'components/Check/Check';

const permissionStatus:Record<NotificationPermission,string> = {
  default: 'haven\'t requested a permission',
  denied: 'permission denied',
  granted: 'permission granted',
}

export const StatusView: FC = () => {
  const [swReady, setSwReady] = useState(false);
  const [hasPushSubscription, setPushSubscription] = useState(false);

   useEffect(() => {
    navigator.serviceWorker.ready.then(()=>setSwReady(true))
    navigator.serviceWorker.getRegistration().then(reg=>reg?.pushManager.getSubscription()).then((sub)=>setPushSubscription(!!sub))
  }, []);

  useEffect(() => {
    const messageHandler = async (event: MessageEvent) => {
      const logMessage = event.data;
      if (logMessage.type === 'SUB') {
        const reg = await navigator.serviceWorker.getRegistration()
        const sub = reg?.pushManager.getSubscription()
        setPushSubscription(!!sub)
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    return () => navigator.serviceWorker.removeEventListener('message', messageHandler);
  }, []);


  return (
    <div className={s.wrapper}>
      <div className={s.api}>Notification API <Check checked={'Notification' in window}/></div>
      <div className={s.api}>Push API <Check checked={'PushManager' in window}/></div>
      <div className={s.api}>Badging API <Check checked={'setAppBadge' in window.navigator}/></div>
      <hr/>
      <div>Service worker: {swReady ? 'ready' : 'not ready'}</div>
      <div>Notifications: {window.Notification ? permissionStatus[window.Notification.permission] : 'not supported'}</div>
      <div>Push subscription: {hasPushSubscription ? 'created' : 'not created'}</div>
    </div>
  );
};
