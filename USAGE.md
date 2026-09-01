# Usage

After starting the development server with `npm run dev`, open your browser to [http://localhost:5173](http://localhost:5173).

## Routes and Screens

### Board (`/`)
- The main Kanban board displays three columns: **To Do**, **In Progress**, and **Done**.
- Drag and drop task cards between columns to change their status.
- Use the **Add Task** form (implemented by `AddTaskForm.tsx`) to create a new task with a title and optional description.

### Task Detail (`/task/:id`)
- Click on any task card to navigate to its detail page.
- The page shows the task title, description, status badge, created/updated timestamps.
- Action buttons allow you to:
  - **Edit**: Open `EditTaskModal` to modify title, description, or status.
  - **Move Left** / **Move Right**: Advance or regress the task to the adjacent column.
  - **Delete**: Remove the task permanently.

### Stats (`/stats`)
- Accessible via the navigation bar link **Stats**.
- Displays overall board statistics:
  - Total number of tasks
  - Count of tasks in each column
  - A list of recently updated tasks, each linking to its detail view.

## Data Persistence
All tasks are stored in the browser’s `localStorage`. The app seeds a set of demo tasks on first load (`seedData.ts`). Modifications (add, edit, move, delete) are persisted automatically.

## Notes
- No login or authentication is required.
- The application is a single-page app; all navigation happens client-side.