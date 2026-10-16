import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; 

const authRoutes = Router();

authRoutes.post("/auth/register", AuthController.register);
authRoutes.post("/auth/login", AuthController.login);
authRoutes.post("/auth/logout", AuthController.logout);
authRoutes.get("/auth/me", authMiddleware, AuthController.me);
authRoutes.post("/auth/forgot-password", AuthController.forgotPassword);
authRoutes.post("/auth/reset-password", AuthController.resetPassword);

export default authRoutes;