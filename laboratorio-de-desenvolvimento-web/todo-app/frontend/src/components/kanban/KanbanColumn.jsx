import { useState } from "react";
import { STATUS_DOT_CLASSES, STATUS_LABELS } from "../../constants/todoStatus.js";
import KanbanCard from "./KanbanCard.jsx";

export default function KanbanColumn({ status, todos, loggedUser, onStatusChange }) {
  const [isDragOver, setIsDragOver] = useState(false);

  // preventDefault em dragover é o que autoriza o drop nesta área
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  // Ignora o "leave" causado pela passagem sobre elementos filhos
  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const todoId = event.dataTransfer.getData("text/plain");
    if (todoId) onStatusChange(todoId, status);
  };

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-xl border p-3 min-h-64 transition-colors ${
        isDragOver ? "bg-blue-50 border-blue-400" : "bg-gray-100 border-gray-200"
      }`}
    >
      <header className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_CLASSES[status]}`} />
          <h3 className="font-semibold text-sm text-gray-700">
            {STATUS_LABELS[status]}
          </h3>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-full px-2 py-0.5">
          {todos.length}
        </span>
      </header>

      <div className="space-y-3 flex-1">
        {todos.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Drop todos here
          </p>
        ) : (
          todos.map((todo) => (
            <KanbanCard
              key={todo._id}
              todo={todo}
              loggedUser={loggedUser}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
}