import { Router } from "express";
import ChatController from "../controllers/ChatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const chatRoutes = Router();

chatRoutes.get("/chat/:todoId/messages", authMiddleware, ChatController.getHistory);

export default chatRoutes;