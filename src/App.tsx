import './App.css';
import { useState } from 'react';

function App() {
  const [showRequestButton, setShowRequestButton] = useState(!(window.Notification?.permission === 'granted'));
  const [permissionGranted, setPermissionGranted] = useState(window.Notification?.permission === 'granted');

  const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      setShowRequestButton(false);
      setPermissionGranted(true);
    }
  };

  const sendNotification = async () => {
    if (!navigator.serviceWorker) {
      console.warn('Service worker not installed');
      return;
    }

    const registration = await navigator.serviceWorker?.ready;

    registration.active?.postMessage(
      { type: 'SEND_NOTIFICATION' }
    );
  };

  return (
    <div>
      <div>
        {showRequestButton && <button onClick={requestNotificationPermission}>
          Request notifications permission
        </button>}
      </div>
      <div>
        {permissionGranted && <button onClick={sendNotification}>
          Send notification
        </button>
        }
      </div>
    </div>
  );
}

export default App;
