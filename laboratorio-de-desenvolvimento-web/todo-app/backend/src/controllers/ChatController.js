import Message from "../models/Message.js";
import { getTodoRoom } from "../sockets/rooms.js";
import { userCanAccessTodo } from "../utils/todoAccess.js";

export default class ChatController {
  static async getHistory(req, res) {
    const { todoId } = req.params;

    try {
      const hasAccess = await userCanAccessTodo(todoId, req.user.id);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Você não tem acesso a esse chat" });
      }

      const messages = await Message.find({ todo: todoId })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

      return res.status(200).json({ messages });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao buscar histórico do chat", error: error.message });
    }
  }

  static async handleSendMessage(io, socket, data) {
    try {
      const { todoId, text } = data ?? {};
      const trimmedText = typeof text === "string" ? text.trim() : "";

      if (!trimmedText) return;

      const hasAccess = await userCanAccessTodo(todoId, socket.user.id);
      if (!hasAccess) {
        socket.emit("chat_error", {
            message: "Você não tem acesso a esse chat",
            });
        return;
      }

      // O remetente vem do token validado, nunca do cliente
      const message = await Message.create({
        todo: todoId,
        sender: socket.user.id,
        text: trimmedText,
      });

      const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name email"
      );

      io.to(getTodoRoom(todoId)).emit("receive_message", populatedMessage);
    } catch (error) {
      console.error("Falha ao salvar ou enviar mensagem:", error);
      socket.emit("chat_error", { message: "Falha ao processar mensagem" });
    }
  }
}