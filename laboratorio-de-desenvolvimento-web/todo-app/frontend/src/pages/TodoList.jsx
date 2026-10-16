import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTodos, updateTodo, deleteTodo } from "../api/todoApi.js";
import TodoItem from "../components/TodoItem.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function TodoList({ loggedUser }) {
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
        if (!ignore) setError(getErrorMessage(err, "Falha em carregar as tarefas"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadTodos();

    // Evita atualizar o estado se o componente for desmontado antes da resposta
    return () => {
      ignore = true;
    };
  }, []);

  const handleStatusChange = async (todoId, status) => {
    try {
      const res = await updateTodo(todoId, { status });
      setTodos((prev) =>
        prev.map((todo) => (todo._id === todoId ? res.data.todo : todo))
      );
    } catch (err) {
      alert("Falha ao atualizar tarefa: " + getErrorMessage(err));
    }
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm("Deletar essa tarefa?")) return;

    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
    } catch (err) {
      alert("Falha ao deletar tarefa: " + getErrorMessage(err));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h2>
          <p className="text-sm text-gray-500">Gerencie suas atividades diárias</p>
        </div>
        <Link
          to="/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Nova Tarefa
        </Link>
      </div>

      {loading && (
        <p className="text-center py-8 text-gray-500">Carregando tarefas...</p>
      )}

      {error && !loading && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nenhum todo encontrado.</p>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                loggedUser={loggedUser} // [NOVO]
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}

    </div>
  );
}