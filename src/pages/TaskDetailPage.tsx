import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskStatus, COLUMNS } from '../types';
import styles from '../styles/TaskDetailPage.module.css';
import formStyles from '../styles/AddTaskForm.module.css';
import EditTaskModal from '../components/EditTaskModal';

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tasks, updateTask, deleteTask, moveTask } = useTasks();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>
          ← Back to Board
        </Link>
        <div className={styles.notFound}>
          <h2>Task not found</h2>
          <p>It may have been deleted, or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  const statusLabel = COLUMNS.find((c) => c.key === task.status)?.label ?? task.status;

  const statusBadgeClass =
    task.status === 'todo'
      ? styles.statusTodo
      : task.status === 'in-progress'
        ? styles.statusInProgress
        : styles.statusDone;

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/');
  };

  const currentColIndex = COLUMNS.findIndex((c) => c.key === task.status);

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to Board
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{task.title}</h1>
        <div className={styles.meta}>
          <span className={`${styles.statusBadge} ${statusBadgeClass}`}>
            {statusLabel}
          </span>
          <span className={styles.metaItem}>
            Created {formatFullDate(task.createdAt)}
          </span>
          <span className={styles.metaItem}>
            Updated {formatFullDate(task.updatedAt)}
          </span>
        </div>
      </div>

      {task.description ? (
        <div className={styles.description}>{task.description}</div>
      ) : (
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', fontStyle: 'italic' }}>
          No description provided.
        </p>
      )}

      <div className={styles.actions}>
        <button className={formStyles.btnPrimary} onClick={() => setEditing(true)}>
          Edit Task
        </button>

        <button
          className={formStyles.btnSecondary}
          onClick={() => {
            if (currentColIndex > 0) {
              moveTask(task.id, COLUMNS[currentColIndex - 1].key);
            }
          }}
          disabled={currentColIndex === 0}
          style={{ opacity: currentColIndex === 0 ? 0.4 : 1 }}
        >
          ← Move Left
        </button>
        <button
          className={formStyles.btnSecondary}
          onClick={() => {
            if (currentColIndex < COLUMNS.length - 1) {
              moveTask(task.id, COLUMNS[currentColIndex + 1].key);
            }
          }}
          disabled={currentColIndex === COLUMNS.length - 1}
          style={{ opacity: currentColIndex === COLUMNS.length - 1 ? 0.4 : 1 }}
        >
          Move Right →
        </button>
        <button className={formStyles.btnDanger} onClick={handleDelete}>
          Delete
        </button>
      </div>

      {editing && (
        <EditTaskModal task={task} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
