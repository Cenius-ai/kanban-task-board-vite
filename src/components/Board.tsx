import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { COLUMNS, Task } from '../types';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import EditTaskModal from './EditTaskModal';
import styles from '../styles/Board.module.css';

export default function Board() {
  const { tasks, moveTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getColumnTasks = (status: string): Task[] =>
    tasks.filter((t) => t.status === status);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    moveTask(draggableId, destination.droppableId as Task['status']);
  };

  return (
    <>
      <div style={{ padding: 'var(--space-lg) var(--space-xl) var(--space-xs)' }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: 'var(--space-sm) var(--space-lg)',
              background: 'var(--color-accent-hex)',
              color: 'oklch(0.15 0.02 260)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + New Task
          </button>
        ) : (
          <div
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-md)',
            }}
          >
            <AddTaskForm onAdded={() => setShowForm(false)} />
            <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: 'var(--space-xs) var(--space-md)',
                  background: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {COLUMNS.map((col) => {
            const columnTasks = getColumnTasks(col.key);
            const dotClass =
              col.key === 'todo'
                ? styles.columnDotTodo
                : col.key === 'in-progress'
                  ? styles.columnDotInProgress
                  : styles.columnDotDone;

            return (
              <div key={col.key} className={styles.column}>
                <div className={styles.columnHeader}>
                  <span className={`${styles.columnDot} ${dotClass}`} />
                  <span className={styles.columnTitle}>{col.label}</span>
                  <span className={styles.columnCount}>{columnTasks.length}</span>
                </div>
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.taskList} ${snapshot.isDraggingOver ? styles.taskListDragging : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                listStyle: 'none',
                              }}
                            >
                              <TaskCard
                                task={task}
                                onEdit={setEditingTask}
                                isDragging={snapshot.isDragging}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
