import mongoose from "mongoose";

const { Schema } = mongoose;

// Valores permitidos para o status de uma tarefa
export const TODO_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: TODO_STATUSES,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;