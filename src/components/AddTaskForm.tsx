import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import styles from '../styles/AddTaskForm.module.css';

interface AddTaskFormProps {
  onAdded?: () => void;
}

export default function AddTaskForm({ onAdded }: AddTaskFormProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title is required.');
      return;
    }
    addTask(trimmed, description.trim());
    setTitle('');
    setDescription('');
    setError('');
    onAdded?.();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="add-title">
          Title
        </label>
        <input
          id="add-title"
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="What needs doing?"
          maxLength={200}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="add-desc">
          Description
        </label>
        <textarea
          id="add-desc"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details…"
          rows={3}
          maxLength={2000}
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary}>
          + Add Task
        </button>
      </div>
    </form>
  );
}
