import { useState } from "react";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  STATUS_ORDER,
} from "../constants/todoStatus.js";
import { formatDueDate } from "../utils/formatDate.js";
import ParticipantAvatars from "./ParticipantAvatars.jsx";
import TodoChatModal from "./TodoChatModal.jsx";

export default function TodoItem({ todo, loggedUser, onStatusChange, onDelete }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isCreator = todo.createdBy?._id === loggedUser?.id;

  return (
    <>
      <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg leading-tight">
              {todo.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${STATUS_BADGE_CLASSES[todo.status]}`}
          >
            {STATUS_LABELS[todo.status]}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium text-gray-700">Data de Entrega:</span>{" "}
              {formatDueDate(todo.dueDate)}
            </div>

            {todo.createdBy && (
              <div>
                <span className="font-medium text-gray-700">Criado por:</span>{" "}
                {todo.createdBy.name}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ParticipantAvatars participants={todo.participants} />

            <button
              onClick={() => setIsChatOpen(true)}
              title="Abrir chat ToDo"
              className="flex items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer"
            >
              <span>💬</span>
              <span>Chat</span>
            </button>

            <select
              value={todo.status}
              onChange={(e) => onStatusChange(todo._id, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-xs"
            >
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            {isCreator && (
              <button
                onClick={() => onDelete(todo._id)}
                className="px-2 py-1 text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>

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