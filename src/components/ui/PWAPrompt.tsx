import { useEffect, useState } from 'react';
import styles from './PWAPrompt.module.css';

export function PWAPrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
                setRegistration(reg);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!needRefresh) return null;

  return (
    <div className={styles.toast} role="alert">
      <span>New version available</span>
      <button className={styles.updateBtn} onClick={handleUpdate} type="button">
        Update
      </button>
      <button
        className={styles.dismissBtn}
        onClick={() => setNeedRefresh(false)}
        type="button"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
