import Message from "../models/Message.js";
import { userCanAccessTodo } from "../utils/todoAccess.js";

export default class ChatController {
  static async getHistory(req, res) {
    const { todoId } = req.params;

    try {
      const hasAccess = await userCanAccessTodo(todoId, req.user.id);
      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "YVocê não tem acesso a esse chat" });
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
}