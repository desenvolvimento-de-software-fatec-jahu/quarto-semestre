import "dotenv/config"; // Deve ser sempre o primeiro import do arquivo
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();

// Permite receber JSON no corpo das requisições
app.use(express.json());

// Libera o frontend para chamar a API
app.use(cors({ origin: FRONTEND_URL }));

// Rota simples para verificar se a API está no ar
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

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