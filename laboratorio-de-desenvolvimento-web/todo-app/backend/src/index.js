import "dotenv/config"; // Deve ser sempre o primeiro import do arquivo
import express from "express";
import { createRequire } from "module";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();