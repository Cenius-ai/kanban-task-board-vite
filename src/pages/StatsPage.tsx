import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { COLUMNS, TaskStatus } from '../types';
import styles from '../styles/StatsPage.module.css';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StatsPage() {
  const { tasks } = useTasks();

  const counts: Record<TaskStatus, number> = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const total = tasks.length;

  const recent = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const statusClass = (s: TaskStatus): string => {
    if (s === 'todo') return styles.recentStatusTodo;
    if (s === 'in-progress') return styles.recentStatusInProgress;
    return styles.recentStatusDone;
  };

  const statusLabel = (s: TaskStatus): string =>
    COLUMNS.find((c) => c.key === s)?.label ?? s;

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Board Stats</h1>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Tasks</div>
          <div className={`${styles.statValue} ${styles.statValueTotal}`}>
            {total}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>To Do</div>
          <div className={`${styles.statValue} ${styles.statValueTodo}`}>
            {counts.todo}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>In Progress</div>
          <div className={`${styles.statValue} ${styles.statValueInProgress}`}>
            {counts['in-progress']}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Done</div>
          <div className={`${styles.statValue} ${styles.statValueDone}`}>
            {counts.done}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recently Updated</h2>
        {recent.length === 0 ? (
          <div className={styles.emptyState}>
            No tasks yet. Add some from the board!
          </div>
        ) : (
          <ul className={styles.recentList}>
            {recent.map((task) => (
              <li key={task.id}>
                <Link
                  to={`/task/${task.id}`}
                  className={styles.recentItem}
                  style={{ textDecoration: 'none', display: 'flex' }}
                >
                  <div className={styles.recentItemLeft}>
                    <span
                      className={`${styles.recentStatus} ${statusClass(task.status)}`}
                    >
                      {statusLabel(task.status)}
                    </span>
                    <span className={styles.recentTitle}>{task.title}</span>
                  </div>
                  <span className={styles.recentDate}>
                    {formatDate(task.updatedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
