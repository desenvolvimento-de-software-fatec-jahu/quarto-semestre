import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Permite enviar cookies junto com as requisições
  headers: { "Content-Type": "application/json" },
});

export default api;