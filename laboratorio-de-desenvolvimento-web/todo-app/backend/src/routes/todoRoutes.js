import { Router } from "express";
import TodoController from "../controllers/TodoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const todoRoutes = Router();

todoRoutes.post("/todos", authMiddleware, TodoController.create);
todoRoutes.get("/todos", authMiddleware, TodoController.getAll);
todoRoutes.get("/todos/:id", authMiddleware, TodoController.getById);
todoRoutes.put("/todos/:id", authMiddleware, TodoController.update);
todoRoutes.patch("/todos/:id/status", authMiddleware, TodoController.updateStatus); 
todoRoutes.delete("/todos/:id", authMiddleware, TodoController.remove);

export default todoRoutes;