// Cookie-session helpers (server-only). Backed by TanStack Start's encrypted
// session, keyed by SESSION_SECRET. Stores just the authenticated user id.
import { useSession } from "@tanstack/react-start/server";
import { prisma } from "./db";

interface SessionData {
  userId?: string;
}

const password =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32
    ? process.env.SESSION_SECRET
    : "dev-only-insecure-session-secret-change-me-please";

export function getAppSession() {
  return useSession<SessionData>({
    name: "gatehouse_session",
    password,
    cookie: { sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" },
  });
}

export async function setSessionUser(userId: string) {
  const session = await getAppSession();
  await session.update({ userId });
}

export async function clearSession() {
  const session = await getAppSession();
  await session.clear();
}

/** The signed-in user with their estate, or null. */
export async function getCurrentUser() {
  const session = await getAppSession();
  const userId = session.data.userId;
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { estate: true },
  });
  return user;
}

/** The signed-in user's estate id, or throws (used by authed server fns). */
export async function requireEstateId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user.estateId;
}
