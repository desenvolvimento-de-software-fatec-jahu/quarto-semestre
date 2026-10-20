import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Cria uma conexão nova, enviando o cookie de sessão no handshake
export function createChatSocket() {
  return io(SOCKET_URL, { withCredentials: true });
}