import { AUTH_COOKIE_NAME, verifyToken } from "../utils/token.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Anexa o payload do token (id, name, email) à requisição
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default authMiddleware;