import mongoose from "mongoose";
import Todo from "../models/Todo.js";

// Retorna true se o usuário é o criador ou um participante da tarefa
export async function userCanAccessTodo(todoId, userId) {
  if (!mongoose.isValidObjectId(todoId)) return false;

  const todo = await Todo.exists({
    _id: todoId,
    $or: [{ createdBy: userId }, { participants: userId }],
  });

  return Boolean(todo);
}