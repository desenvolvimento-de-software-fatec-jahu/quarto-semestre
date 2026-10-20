import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo } from "../api/todoApi.js";
import { getUsers } from "../api/userApi.js";
import VoiceControls from "../components/VoiceControls.jsx";
import {
  STATUS_LABELS,
  STATUS_ORDER,
  TODO_STATUS,
} from "../constants/todoStatus.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition.js";
import { normalizeText } from "../utils/normalizeText.js";
import { parseSpokenDate } from "../utils/spokenDate.js";
import { parseSpokenStatus, parseVoiceCommand } from "../utils/voiceCommands.js";

const VOICE_TIPS = [
  { command: "título comprar leite", description: "preenche o título" },
  { command: "descrição ir ao mercado", description: "preenche a descrição" },
  { command: "data amanhã / prazo daqui a 3 dias", description: "programa a data de entrega" },
  { command: "adicionar Maria", description: "seleciona um participante" },
  { command: "status em andamento", description: "configura o status" },
];

export default function TodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(TODO_STATUS.PENDING);
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [voiceFeedback, setVoiceFeedback] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const res = await getUsers();
        if (!ignore) setUsers(res.data.users || []);
      } catch (error) {
        console.error("Falha ao carregar usuários:", error);
      } finally {
        if (!ignore) setLoadingUsers(false);
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const toggleParticipant = (userId) => {
    setParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const addParticipant = (userId) => {
    setParticipants((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  };

  // Recebe cada frase finalizada pelo reconhecedor e aplica no formulário
  const handleVoiceTranscript = (transcript) => {
    const command = parseVoiceCommand(transcript);

    if (!command) {
      setVoiceFeedback(`Comando não reconhecido: "${transcript}"`);
      return;
    }

    switch (command.type) {
      case "title":
        setTitle(command.value);
        setVoiceFeedback("Título preenchido");
        break;

      case "description":
        setDescription(command.value);
        setVoiceFeedback("Descrição preenchida");
        break;

      case "dueDate": {
        const date = parseSpokenDate(command.value);
        if (date) {
          setDueDate(date);
          setVoiceFeedback(`Data de entrega configurada para ${date}`);
        } else {
          setVoiceFeedback(`Não foi possível compreender a data: "${command.value}"`);
        }
        break;
      }

      case "participant": {
        const spokenName = normalizeText(command.value);
        const user = users.find((item) =>
          normalizeText(item.name).includes(spokenName)
        );
        if (user) {
          addParticipant(user._id);
          setVoiceFeedback(`${user.name} added`);
        } else {
          setVoiceFeedback(`Usuário não encontrado: "${command.value}"`);
        }
        break;
      }

      case "status": {
        const parsedStatus = parseSpokenStatus(command.value);
        if (parsedStatus) {
          setStatus(parsedStatus);
          setVoiceFeedback(`Status configurado para ${STATUS_LABELS[parsedStatus]}`);
        } else {
          setVoiceFeedback(`Não foi possível compreender status: "${command.value}"`);
        }
        break;
      }

      default:
        break;
    }
  };

  const { isSupported, isListening, voiceError, toggleListening } =
    useVoiceRecognition({ onTranscript: handleVoiceTranscript });

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

      <VoiceControls
        isSupported={isSupported}
        isListening={isListening}
        onToggle={toggleListening}
        error={voiceError}
        feedback={voiceFeedback}
        tips={VOICE_TIPS}
      />

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
            <option value="">Selecione um status...</option>
            {STATUS_ORDER.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Participantes</label>

          {loadingUsers ? (
            <p className="text-sm text-gray-500">Carregando usuários...</p>
          ) : (
            <div className="max-h-40 overflow-y-auto border rounded p-3 space-y-2 bg-gray-50">
              {users.length > 0 ? (
                users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={participants.includes(user._id)}
                      onChange={() => toggleParticipant(user._id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Não há outros usuários disponíveis.                </p>
              )}
            </div>
          )}
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