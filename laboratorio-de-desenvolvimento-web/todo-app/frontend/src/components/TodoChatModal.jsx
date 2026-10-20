import { useState, useEffect, useRef } from "react";
import { getChatHistory } from "../api/chatApi.js";
import { createChatSocket } from "../services/socket.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function TodoChatModal({ todo, loggedUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    // 1) Histórico salvo no banco
    async function loadHistory() {
      try {
        const res = await getChatHistory(todo._id);
        const history = res.data.messages || [];

        if (!ignore) {
          // Mantém mensagens que chegaram em tempo real durante o carregamento
          setMessages((prev) => {
            const historyIds = new Set(history.map((message) => message._id));
            return [
              ...history,
              ...prev.filter((message) => !historyIds.has(message._id)),
            ];
          });
        }
      } catch (error) {
        if (!ignore) {
          setChatError(getErrorMessage(error, "Falha ao carregar histórico do chat"));
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadHistory();

    // 2) Conexão em tempo real
    const socket = createChatSocket();
    socketRef.current = socket;

    // Entra na sala a cada (re)conexão
    socket.on("connect", () => {
      socket.emit("join_todo", todo._id);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) =>
        prev.some((item) => item._id === message._id) ? prev : [...prev, message]
      );
    });

    socket.on("chat_error", (payload) => setChatError(payload.message));
    socket.on("connect_error", (error) => setChatError(error.message));

    // 3) Limpeza ao fechar o modal
    return () => {
      ignore = true;
      socket.emit("leave_todo", todo._id);
      socket.disconnect();
    };
  }, [todo._id]);

  // Rola até a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();

    const text = newText.trim();
    if (!text || !socketRef.current) return;

    // O servidor identifica o remetente pelo cookie, então enviamos só a tarefa e o texto
    socketRef.current.emit("send_message", { todoId: todo._id, text });
    setNewText("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg flex flex-col h-[550px] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{todo.title}</h3>
            <p className="text-xs text-gray-500">Chat todo em tempo real</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 px-2 rounded-lg hover:bg-gray-200 text-xl font-bold cursor-pointer"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {chatError && (
          <div className="px-4 py-2 bg-red-50 text-red-700 text-xs border-b border-red-200">
            {chatError}
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">
              Carregando histórico...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              Ainda sem mensagens. Inicie uma conversa!
            </p>
          ) : (
            messages.map((message) => {
              const isMine =
                (message.sender?._id || message.sender) === loggedUser.id;

              return (
                <div
                  key={message._id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5 px-1">
                    {message.sender?.name || "Usuário"}
                  </span>
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                      isMine
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3 border-t border-gray-200 bg-white flex gap-2"
        >
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Escreva sua mensagem..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}