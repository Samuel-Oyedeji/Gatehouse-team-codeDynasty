// Signup / login / logout (PRD §8 auth). Passwords hashed with bcrypt; a new
// signup also creates the manager's estate (details filled in during onboarding).
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { setSessionUser, clearSession } from "./session";

export interface SignupInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  estateName?: string;
}

export async function signup(input: SignupInput) {
  const email = input.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_TAKEN");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const estate = await prisma.estate.create({
    data: {
      name: input.estateName?.trim() || "My Estate",
      address: "",
      city: "",
      cycleLabel: "",
    },
  });
  const user = await prisma.user.create({
    data: {
      estateId: estate.id,
      name: input.name,
      email,
      phone: input.phone,
      role: "treasurer",
      passwordHash,
    },
  });
  await setSessionUser(user.id);
  return { userId: user.id, estateId: estate.id };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");
  await setSessionUser(user.id);
  return { userId: user.id, estateId: user.estateId };
}

export async function logout() {
  await clearSession();
}
