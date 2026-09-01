import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { Task, TaskStatus } from '../types';
import { taskReducer, TaskAction } from './TaskReducer';
import { SEED_TASKS } from '../seedData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'kanban-board-tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Corrupt data — fall through to seed
  }
  // First load: seed demo data and persist
  const seeded = SEED_TASKS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

interface TaskContextValue {
  tasks: Task[];
  dispatch: React.Dispatch<TaskAction>;
  addTask: (title: string, description: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadTasks);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, newStatus } });
  };

  return (
    <TaskContext.Provider value={{ tasks, dispatch, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
}
