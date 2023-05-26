import React, { useState, useEffect } from 'react';
import { LogView } from 'components/LogView/LogView';
import s from 'App.module.css';
import { StatusView } from 'components/StatusView/StatusView';

function App() {
  const [showRequestButton, setShowRequestButton] = useState(!(window.Notification?.permission === 'granted'));
  const [permissionGranted, setPermissionGranted] = useState(window.Notification?.permission === 'granted');

  const [tab, setTab] = useState<'status' | 'log'>('status');

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
        {showRequestButton && <button className={'button'} onClick={requestNotificationPermission}>
          Request notifications permission
        </button>}
        {permissionGranted && <button className={'button'} onClick={sendLocalNotification}>
          Show local notification
        </button>}
        {permissionGranted && <button className={'button'} onClick={requestPush}>
          Request push from server
        </button>}
      </div>

      <div className={s.tabContainer}>
        <div className={s.tabSelect}>
          <button className={`${s.tabButton} ${tab === 'status' && s.selected}`}
                  onClick={() => setTab('status')}>Status
          </button>
          <button className={`${s.tabButton} ${tab === 'log' && s.selected}`} onClick={() => setTab('log')}>Log</button>
        </div>
        <div className={`${s.tabContent} ${tab !== 'status' ? s.hidden : ''}`}><StatusView/></div>
        <div className={`${s.tabContent} ${tab !== 'log' ? s.hidden : ''}`}><LogView/></div>
      </div>

      <div className={s.build}>Build: {import.meta.env.VITE_BUILD}</div>
    </div>
  );
}

export default App;
