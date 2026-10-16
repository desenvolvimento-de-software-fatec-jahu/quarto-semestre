import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi.js";
import FormField from "../components/FormField.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setFeedback("");

        try {
            const res = await forgotPassword({ email });
            setFeedback(res.data.message);
        } catch (err) {
            setError(getErrorMessage(err, "Falha ao solicitar redefinição de senha"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Esqueceu sua senha
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Insira seu e-mail e enviaremos um link para redefinição.      </p>

            {feedback && (
                <div className="p-3 mb-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
                    {feedback}
                </div>
            )}
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
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Enviando..." : "Enviar link de redefinição"}
                </button>
            </form>

            <p className="mt-5 text-center text-sm">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Voltar para Entrar
                </Link>
            </p>
        </div>
    );
}