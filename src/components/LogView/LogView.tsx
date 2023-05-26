import { useEffect, useState, FC } from 'react';
import s from './LogView.module.css';

export const LogView: FC = () => {
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const logMessage = event.data;
      if (logMessage.type === 'LOG') {
        setEntries((prev) => [...prev, `[SW] ${logMessage.message}`]);
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    return () => navigator.serviceWorker.removeEventListener('message', messageHandler);
  }, []);

  return <div className={s.wrapper}>
    <div className={s.content}>{entries.join('\n')}</div>
  </div>;
};
