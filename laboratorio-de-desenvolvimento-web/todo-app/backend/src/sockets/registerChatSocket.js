import ChatController from "../controllers/ChatController.js";
import { userCanAccessTodo } from "../utils/todoAccess.js";
import { getTodoRoom } from "./rooms.js";

export default function registerChatSocket(io, socket) {
  // Entrar na sala de uma tarefa (somente criador e participantes)
  socket.on("join_todo", async (todoId) => {
    try {
      const hasAccess = await userCanAccessTodo(todoId, socket.user.id);

      if (!hasAccess) {
        socket.emit("chat_error", {
          message: "Você não tem acesso a esse chat",
        });
        return;
      }

      socket.join(getTodoRoom(todoId));
    } catch (error) {
      socket.emit("chat_error", { message: "Falha ao entrar no chat" });
    }
  });

  // Enviar mensagem
  socket.on("send_message", (data) => {
    ChatController.handleSendMessage(io, socket, data);
  });

  // Sair da sala
  socket.on("leave_todo", (todoId) => {
    socket.leave(getTodoRoom(todoId));
  });
}