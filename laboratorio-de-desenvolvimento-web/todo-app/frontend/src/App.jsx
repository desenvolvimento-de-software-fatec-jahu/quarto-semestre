import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "./api/authApi.js";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import TodoList from "./pages/TodoList.jsx";
import TodoForm from "./pages/TodoForm.jsx";

export default function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  // Ao abrir o app, verifica se já existe uma sessão válida (cookie)
  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const res = await getProfile();
        if (!ignore) setLoggedUser(res.data.user);
      } catch {
        if (!ignore) setLoggedUser(null);
      } finally {
        if (!ignore) setLoadingSession(false);
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedUser(user);
    navigate("/todos");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setLoggedUser(null);
      navigate("/");
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={loggedUser ? <Navigate to="/todos" replace /> : <LandingPage />}
      />

      <Route element={<AppLayout loggedUser={loggedUser} onLogout={handleLogout} />}>
        <Route
          path="/login"
          element={
            loggedUser ? (
              <Navigate to="/todos" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/todos"
          element={
            <ProtectedRoute loggedUser={loggedUser}>
              <TodoList loggedUser={loggedUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute loggedUser={loggedUser}>
              <TodoForm />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}