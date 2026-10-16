import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import FormField from "../components/FormField.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao cadastrar"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Criar conta
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="name"
          label="Nome"
          required
          disabled={loading}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Senha (min. 8 caracteres)"
          type="password"
          required
          minLength={8}
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  );
}