import mongoose from "mongoose";
import Todo from "../models/Todo.js";
import Message from "../models/Message.js";

// Campos que podem ser alterados em uma atualização
const UPDATABLE_FIELDS = ["title", "description", "dueDate", "status"];

const userAccessFilter = (userId) => ({
  $or: [{ createdBy: userId }, { participants: userId }],
});

const populateTodo = (query) =>
  query.populate("createdBy", "name email").populate("participants", "name email");

function normalizeParticipants(participants, ownerId) {
  if (participants === undefined) return [];
  if (!Array.isArray(participants)) return null;
  if (!participants.every((id) => mongoose.isValidObjectId(id))) return null;
  return [...new Set(participants)].filter((id) => id !== ownerId);
}

export default class TodoController {
  static async create(req, res) {
    const { title, description, dueDate, status, participants } = req.body ?? {};

    if (!title || !description || !dueDate) {
      return res
        .status(422)
        .json({ message: "Título, descrição e data de entrega são obrigatórias" });
    }

    const participantIds = normalizeParticipants(participants, req.user.id);
    if (participantIds === null) {
      return res
        .status(422)
        .json({ message: "Participantes deve ser uma lista de IDs de usuários válidos" });
    }

    try {
      const todo = await Todo.create({ title, description, dueDate, status, participants: participantIds, createdBy: req.user.id });

      const populatedTodo = await populateTodo(Todo.findById(todo._id));

      return res
        .status(201)
        .json({ message: "Tarefa criada com sucesso", todo: populatedTodo });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(422).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Falha ao criar tarefa", error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const todos = await populateTodo(
        Todo.find(userAccessFilter(req.user.id)).sort({ createdAt: -1 })
      );
      return res.status(200).json({ todos });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao buscar tarefas", error: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Id da tarefa inválido" });
    }

    try {
      const todo = await populateTodo(
        Todo.findOne({ _id: id, ...userAccessFilter(req.user.id) })
      );

      if (!todo) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res.status(200).json({ todo });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao buscar tarefa", error: error.message });
    }
  }

  static async update(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Id da tarefa inválido" });
    }

    // Monta o objeto de atualização apenas com os campos enviados
    const updates = {};
    for (const field of UPDATABLE_FIELDS) {
      if (req.body?.[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    try {
      const todo = await populateTodo(
        Todo.findOneAndUpdate(
          { _id: id, ...userAccessFilter(req.user.id) },
          updates,
          { new: true, runValidators: true }
        )
      );

      if (!todo) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res
        .status(200)
        .json({ message: "Tarefa atualizada com sucesso", todo });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(422).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Falha ao atualizar tarefa", error: error.message });
    }
  }

  static async remove(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Id da tarefa inválido" });
    }

    try {
      const todo = await Todo.findOneAndDelete({
        _id: id,
        createdBy: req.user.id,
      });

      if (!todo) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      await Message.deleteMany({ todo: todo._id });

      return res.status(200).json({ message: "Tarefa excluída com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao excluir tarefa", error: error.message });
    }
  }
}