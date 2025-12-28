import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type TokenPayload = {
  adminId: string;
  email: string;
  role: string;
};

const TOKEN_TTL = "7d";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(payload, secret, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return getCookieValue(request, "auth-token");
}

export function getRefreshTokenFromRequest(request: Request) {
  return getCookieValue(request, "refresh-token");
}

function getCookieValue(request: Request, name: string) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
