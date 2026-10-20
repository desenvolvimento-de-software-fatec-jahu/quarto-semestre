import { AUTH_COOKIE_NAME, verifyToken } from "../utils/token.js";

// Transforma o cabeçalho "a=1; b=2" em { a: "1", b: "2" }
function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

export default function socketAuth(socket, next) {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies[AUTH_COOKIE_NAME];

    if (!token) {
      return next(new Error("Não autenticado"));
    }

    socket.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(new Error("Sessão inválida ou expirada"));
  }
}