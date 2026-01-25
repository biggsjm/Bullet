import { Outlet, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import styles from './Layout.module.css';

export function Layout() {
  const navigate = useNavigate();

  useKeyboardShortcuts([
    { key: '1', handler: () => navigate('/daily'), description: 'Go to Daily Log' },
    { key: '2', handler: () => navigate('/monthly'), description: 'Go to Monthly Log' },
    { key: '3', handler: () => navigate('/future'), description: 'Go to Future Log' },
  ]);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
