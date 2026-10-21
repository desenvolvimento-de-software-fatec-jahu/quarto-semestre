import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTodos, updateTodoStatus } from "../api/todoApi.js";
import KanbanColumn from "../components/kanban/KanbanColumn.jsx";
import { STATUS_ORDER } from "../constants/todoStatus.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function KanbanBoard({ loggedUser }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTodos() {
      try {
        const res = await getTodos();
        if (!ignore) setTodos(res.data.todos || []);
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err, "Failed to load todos"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTodos();

    return () => {
      ignore = true;
    };
  }, []);

  // Move a tarefa de coluna (arraste ou select)
  const handleStatusChange = async (todoId, newStatus) => {
    const currentTodo = todos.find((todo) => todo._id === todoId);
    if (!currentTodo || currentTodo.status === newStatus) return;

    const previousTodos = todos;
    setError("");

    // Atualização otimista: o cartão muda de coluna antes da resposta da API
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === todoId ? { ...todo, status: newStatus } : todo
      )
    );

    try {
      await updateTodoStatus(todoId, newStatus);
    } catch (err) {
      // Desfaz a mudança visual se a API recusar
      setTodos(previousTodos);
      setError(getErrorMessage(err, "Failed to move todo"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Board</h2>
          <p className="text-sm text-gray-500">
            Drag the cards between columns to update their status
          </p>
        </div>
        <Link
          to="/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Todo
        </Link>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading board...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {STATUS_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              todos={todos.filter((todo) => todo.status === status)}
              loggedUser={loggedUser}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}