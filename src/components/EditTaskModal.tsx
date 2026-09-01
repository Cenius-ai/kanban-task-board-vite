import { useState, useEffect } from 'react';
import { Task, TaskStatus, COLUMNS } from '../types';
import { useTasks } from '../context/TaskContext';
import styles from '../styles/EditTaskModal.module.css';
import formStyles from '../styles/AddTaskForm.module.css';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export default function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const { updateTask, deleteTask } = useTasks();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title is required.');
      return;
    }
    updateTask(task.id, { title: trimmed, description: description.trim(), status });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Edit Task</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={formStyles.formGroup}>
            <label className={formStyles.label} htmlFor="edit-title">
              Title
            </label>
            <input
              id="edit-title"
              className={formStyles.input}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              maxLength={200}
            />
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.label} htmlFor="edit-desc">
              Description
            </label>
            <textarea
              id="edit-desc"
              className={formStyles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.label} htmlFor="edit-status">
              Status
            </label>
            <select
              id="edit-status"
              className={formStyles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {COLUMNS.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>
          </div>
          {error && <div className={formStyles.error}>{error}</div>}
          <div className={formStyles.actions}>
            <button className={formStyles.btnPrimary} onClick={handleSave}>
              Save Changes
            </button>
            <button className={formStyles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button className={formStyles.btnDanger} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
