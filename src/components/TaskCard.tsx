import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { Task, TaskStatus, COLUMNS } from '../types';
import styles from '../styles/TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function TaskCard({ task, onEdit, isDragging }: TaskCardProps) {
  const { moveTask, deleteTask } = useTasks();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/task/${task.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      deleteTask(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const currentColIndex = COLUMNS.findIndex((c) => c.key === task.status);

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentColIndex > 0) {
      moveTask(task.id, COLUMNS[currentColIndex - 1].key);
    }
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentColIndex < COLUMNS.length - 1) {
      moveTask(task.id, COLUMNS[currentColIndex + 1].key);
    }
  };

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
      onClick={handleClick}
    >
      <div className={styles.cardTitle}>{task.title}</div>
      {task.description && (
        <div className={styles.cardDescription}>{task.description}</div>
      )}
      <div className={styles.cardMeta}>
        <span>{formatDate(task.updatedAt)}</span>
        <div className={styles.cardActions}>
          <div className={styles.clickMove}>
            <button
              className={styles.moveArrow}
              onClick={handleMoveLeft}
              disabled={currentColIndex === 0}
              title="Move left"
              style={{
                opacity: currentColIndex === 0 ? 0.3 : 1,
              }}
            >
              ←
            </button>
            <button
              className={styles.moveArrow}
              onClick={handleMoveRight}
              disabled={currentColIndex === COLUMNS.length - 1}
              title="Move right"
              style={{
                opacity: currentColIndex === COLUMNS.length - 1 ? 0.3 : 1,
              }}
            >
              →
            </button>
          </div>
          <button
            className={styles.actionBtn}
            onClick={handleEdit}
            title="Edit task"
          >
            ✎
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
          >
            {confirmDelete ? '✓' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
}
