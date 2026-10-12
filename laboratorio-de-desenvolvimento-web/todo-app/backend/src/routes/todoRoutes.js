import { Router } from "express";
import TodoController from "../controllers/TodoController.js";

const todoRoutes = Router();

todoRoutes.post("/todos", TodoController.create);
todoRoutes.get("/todos", TodoController.getAll);
todoRoutes.get("/todos/:id", TodoController.getById);
todoRoutes.put("/todos/:id", TodoController.update);
todoRoutes.delete("/todos/:id", TodoController.remove);

export default todoRoutes;