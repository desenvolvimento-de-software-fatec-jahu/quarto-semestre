import { Routes, Route, Link, Navigate } from "react-router-dom";
import TodoList from "./pages/TodoList.jsx";
import TodoForm from "./pages/TodoForm.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-3xl mx-auto mb-8">
        <nav className="flex items-center justify-between">
          <Link to="/todos" className="text-2xl font-bold text-gray-900">
            Tarefas
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/todos" replace />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/new" element={<TodoForm />} />
        </Routes>
      </main>
    </div>
  );
}