import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi.js";
import FormField from "../components/FormField.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resetPassword({ token, newPassword });
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Falha ao redefinir senha"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200 text-center">
        <p className="text-gray-700 mb-4">Token de redefinição inválido ou ausente.</p>
        <Link to="/forgot" className="text-blue-600 hover:text-blue-800 font-medium">
          Solicitar um novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Escolha uma nova senha
      </h2>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="newPassword"
          label="Nova senha (min. 8 caracteres)"
          type="password"
          required
          minLength={8}
          disabled={loading}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}