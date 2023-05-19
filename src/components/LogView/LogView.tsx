import { useEffect, useState, FC } from 'react';
import s from './LogView.module.css';

type Props = {
  className: string
}

export const LogView: FC<Props> = ({ className }) => {
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
    <h1>Logs:</h1>
    <div className={className} style={{whiteSpace:'pre'}}>{entries.join('\n')}</div>
  </div>;
};
