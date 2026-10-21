import { useState } from "react";
import { STATUS_LABELS, STATUS_ORDER } from "../../constants/todoStatus.js";
import { formatDueDate, isOverdue } from "../../utils/formatDate.js";
import ParticipantAvatars from "../ParticipantAvatars.jsx";
import TodoChatModal from "../TodoChatModal.jsx";

export default function KanbanCard({ todo, loggedUser, onStatusChange }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const overdue = isOverdue(todo.dueDate, todo.status);

  // Guarda o id da tarefa no objeto de arraste; a coluna lê esse id ao soltar
  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", todo._id);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <article
        draggable
        onDragStart={handleDragStart}
        className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing space-y-2"
      >
        <h4 className="font-semibold text-gray-800 text-sm leading-tight">
          {todo.title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-2">{todo.description}</p>

        <div className="flex items-center justify-between text-xs">
          <span className={overdue ? "text-red-600 font-semibold" : "text-gray-500"}>
            {overdue ? "Overdue: " : "Due: "}
            {formatDueDate(todo.dueDate)}
          </span>

          <button
            onClick={() => setIsChatOpen(true)}
            title="Open todo chat"
            className="px-2 py-0.5 text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer"
          >
            💬 Chat
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
          <ParticipantAvatars participants={todo.participants} />

          {/* Alternativa ao arraste (telas de toque e acessibilidade) */}
          <select
            value={todo.status}
            onChange={(e) => onStatusChange(todo._id, e.target.value)}
            aria-label="Change status"
            className="border border-gray-300 rounded px-1.5 py-1 bg-white text-xs ml-auto"
          >
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </article>

      {isChatOpen && (
        <TodoChatModal
          todo={todo}
          loggedUser={loggedUser}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}