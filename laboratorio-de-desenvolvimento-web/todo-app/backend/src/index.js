import "dotenv/config"; // Deve ser sempre o primeiro import do arquivo
import express from "express";
import { createServer } from "http";
import { createRequire } from "module";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import socketAuth from "./sockets/socketAuth.js";
import registerChatSocket from "./sockets/registerChatSocket.js";

const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger-output.json");

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174" || "http://localhost:5173";

const app = express();

// Permite receber JSON no corpo das requisições
app.use(express.json());

// Libera o frontend para chamar a API
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

app.use(cookieParser());

// Rota simples para verificar se a API está no ar
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", todoRoutes);
app.use("/api", chatRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: FRONTEND_URL, credentials: true },
});

// Todo socket precisa estar autenticado antes de conectar
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.user.name} (${socket.id})`);

  registerChatSocket(io, socket);

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${socket.user.name} (${socket.id})`);
  });
});

async function startServer() {
  try {
    await connectDatabase();
    httpServer.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();