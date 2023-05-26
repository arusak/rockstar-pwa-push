import React, { useState, useEffect } from 'react';
import { LogView } from 'components/LogView/LogView';
import s from 'App.module.css';
import { Check } from 'components/Check/Check';

function App() {
  const [showRequestButton, setShowRequestButton] = useState(!(window.Notification?.permission === 'granted'));
  const [permissionGranted, setPermissionGranted] = useState(window.Notification?.permission === 'granted');

  useEffect(() => {
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const registration = await navigator.serviceWorker?.ready;
        registration.active?.postMessage(
          { type: 'APP_OPEN' }
        );
      }
    });
  }, []);

  const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      setShowRequestButton(false);
      setPermissionGranted(true);
    }
  };

  const sendLocalNotification = async () => {
    if (!navigator.serviceWorker) {
      console.warn('Service worker not installed');
      return;
    }

    const registration = await navigator.serviceWorker?.ready;
    registration.active?.postMessage(
      { type: 'SEND_NOTIFICATION' }
    );
  };

  const requestPush = async () => {
    if (!navigator.serviceWorker) {
      console.warn('Service worker not installed');
      return;
    }

    const registration = await navigator.serviceWorker?.ready;

    registration.active?.postMessage(
      { type: 'REQUEST_PUSH' }
    );
  };

  return (
    <div className={s.wrapper}>
      <div className={s.buttons}>
        {showRequestButton && <button onClick={requestNotificationPermission}>
          Request notifications permission
        </button>}
        {permissionGranted && <button onClick={sendLocalNotification}>
          Show local notification
        </button>}
        {permissionGranted && <button onClick={requestPush}>
          Request push from server
        </button>}
      </div>

      <LogView className={s.log}/>

      <div className={s.support}>
        <h1>Your browser's supported APIs:</h1>
        <div className={s.apis}>
          <div className={s.api}><Check checked={'Notification' in window}/> Notification</div>
          <div className={s.api}><Check checked={'PushManager' in window}/> Push</div>
          <div className={s.api}><Check checked={'setAppBadge' in window.navigator}/> Badging</div>
        </div>
        <div className={s.build}>{import.meta.env.VITE_BUILD}</div>
      </div>
    </div>
  );
}

export default App;
