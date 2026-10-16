import { Navigate } from "react-router-dom";

// Só renderiza a página se houver usuário logado
export default function ProtectedRoute({ loggedUser, children }) {
  return loggedUser ? children : <Navigate to="/login" replace />;
}