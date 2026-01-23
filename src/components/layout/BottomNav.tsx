import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const navItems = [
  { to: '/daily', label: 'Daily', icon: '•' },
  { to: '/monthly', label: 'Monthly', icon: '▦' },
  { to: '/future', label: 'Future', icon: '»' },
  { to: '/index', label: 'Index', icon: '☰' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ''}`
          }
          aria-label={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
