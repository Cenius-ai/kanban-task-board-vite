import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import NavBar from './components/NavBar';
import Board from './components/Board';
import TaskDetailPage from './pages/TaskDetailPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/task/:id" element={<TaskDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route
            path="*"
            element={
              <div
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-2xl)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <h2>Page not found</h2>
                <p>
                  <a href="/">Go to the board</a>
                </p>
              </div>
            }
          />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
}
