import argon2 from "argon2";
import User from "../models/User.js";

export default class AuthController {
  static async register(req, res) {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ message: "Nome, email e senha são obrigatórios" });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res
        .status(422)
        .json({ message: "Senha deve ter pelo menos 8 caracteres" });
    }

    try {
      const hashedPassword = await argon2.hash(password);
      const user = await User.create({ name, email, password: hashedPassword });

      // Nunca devolva o hash da senha na resposta
      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      // 11000 = violação do índice unique (e-mail já cadastrado)
      if (error.code === 11000) {
        return res.status(409).json({ message: "Email já está em uso" });
      }
      return res
        .status(500)
        .json({ message: "Falha ao cadastrar usuário", error: error.message });
    }
  }
}