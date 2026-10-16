import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRoutes = Router();

userRoutes.get("/users", authMiddleware, UserController.listOthers);

export default userRoutes;