import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET || "fallback-secret";
const SESSION_COOKIE = "admin_session";

export function createSession(): string {
  const token = Buffer.from(`${SECRET}:${Date.now()}`).toString("base64");
  return token;
}

export function validateSession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${SECRET}:`);
  } catch {
    return false;
  }
}

export function getSession(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

export function isAuthenticated(): boolean {
  const session = getSession();
  if (!session) return false;
  return validateSession(session);
}
