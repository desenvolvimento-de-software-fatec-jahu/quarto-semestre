import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "token";
export const TOKEN_MAX_AGE_MS = 60 * 60 * 1000; // 1 hora

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não definido no .env");
  }
  return secret;
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: Math.floor(TOKEN_MAX_AGE_MS / 1000),
  });
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

// Opções do cookie de sessão (o JavaScript do navegador não consegue ler)
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: TOKEN_MAX_AGE_MS,
};