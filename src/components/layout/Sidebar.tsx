import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/daily', label: 'Daily Log', icon: '•' },
  { to: '/monthly', label: 'Monthly Log', icon: '▦' },
  { to: '/future', label: 'Future Log', icon: '»' },
  { to: '/index', label: 'Index', icon: '☰' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar} aria-label="Sidebar navigation">
      <div className={styles.header}>
        <h1 className={styles.title}>Bullet</h1>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? '◐' : '◑'} {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
      </div>
    </aside>
  );
}
