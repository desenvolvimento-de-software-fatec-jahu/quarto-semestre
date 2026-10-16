import crypto from "crypto";
import argon2 from "argon2";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../services/EmailService.js"; 
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  signToken,
} from "../utils/token.js";

const RESET_TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
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

  static async login(req, res) {
    const { email, password } = req.body ?? {};
    console.log("Senha recebida no backend:", password);

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(422).json({ message: "Email e senha são obrigatórios" });
    }

    try {
      const user = await User.findOne({ email }).select("+password");

      // A mesma mensagem para e-mail inexistente e senha errada evita revelar quais e-mails existem
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const passwordMatches = await argon2.verify(user.password, password);
      if (!passwordMatches) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = signToken({ id: user.id, name: user.name, email: user.email });
      res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

      return res.status(200).json({
        message: "Login bem-sucedido",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao fazer login", error: error.message });
    }
  }

  static async logout(req, res) {
    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
    return res.status(200).json({ message: "Logout bem-sucedido" });
  }

  static async me(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to fetch user", error: error.message });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body ?? {};

    if (typeof email !== "string" || !email) {
      return res.status(422).json({ message: "Email é obrigatório" });
    }

    // Resposta idêntica exista o e-mail ou não, para não revelar cadastros
    const genericResponse = {
      message: "Se o email estiver cadastrado, um link de redefinição será enviado",
    };

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).json(genericResponse);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      await User.findByIdAndUpdate(user.id, {
        resetPasswordToken: hashResetToken(resetToken),
        resetPasswordExpires: new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS),
      });

      await sendPasswordResetEmail(user.email, resetToken);

      return res.status(200).json(genericResponse);
    } catch (error) {
      console.error("Falha ao processar solicitação de redefinição de senha:", error);
      return res.status(200).json(genericResponse);
    }
  }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body ?? {};

    if (typeof token !== "string" || typeof newPassword !== "string") {
      return res
        .status(422)
        .json({ message: "Token e nova senha são obrigatórios" });
    }

    if (newPassword.length < 8) {
      return res
        .status(422)
        .json({ message: "A senha deve ter pelo menos 8 caracteres" });
    }

    try {
      const user = await User.findOne({
        resetPasswordToken: hashResetToken(token),
        resetPasswordExpires: { $gt: new Date() },
      }).select("+password +resetPasswordToken +resetPasswordExpires");

      if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      user.password = await argon2.hash(newPassword);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha ao redefinir senha", error: error.message });
    }
  }
}