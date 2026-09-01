import { NavLink } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <span className={styles.brand}>
        <span className={styles.brandAccent}>⬢</span> Kanban
      </span>
      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`
          }
        >
          Board
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`
          }
        >
          Stats
        </NavLink>
      </div>
    </nav>
  );
}
