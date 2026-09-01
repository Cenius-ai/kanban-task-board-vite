import { Task, TaskStatus } from '../types';

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { id: string; newStatus: TaskStatus } }
  | { type: 'LOAD_TASKS'; payload: Task[] };

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];

    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : task
      );

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);

    case 'MOVE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.newStatus, updatedAt: new Date().toISOString() }
          : task
      );

    case 'LOAD_TASKS':
      return action.payload;

    default:
      return state;
  }
}
