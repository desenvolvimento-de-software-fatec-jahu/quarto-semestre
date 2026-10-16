import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/authApi.js";
import FormField from "../components/FormField.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({ email, password });
      // O App guarda o usuário logado e redireciona
      onLoginSuccess(res.data.user);
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao entrar"));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Entrar
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          required
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm space-y-2">
        <p>
          <Link to="/forgot" className="text-blue-600 hover:text-blue-800 font-medium">
            Esqueceu sua senha?
          </Link>
        </p>
        <p className="text-gray-600">
          Ainda não tem uma conta?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}