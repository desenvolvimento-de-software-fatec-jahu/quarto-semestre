import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../api/todoApi.js";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  TODO_STATUS,
} from "../constants/todoStatus.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(TODO_STATUS.PENDING);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createTodo({ title, description, dueDate, status });
      navigate("/todos");
    } catch (error) {
      alert("Falha ao criar tarefa: " + getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Tarefa</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data de Entrega</label>
          <input
            required
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            {STATUS_ORDER.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}