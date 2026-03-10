import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withDbTimeout } from "@/lib/db-guard";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE } from "@/lib/constants";
const encoder = new TextEncoder();

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return encoder.encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: Pick<User, "id" | "email" | "name">) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    // API routes and server components both rely on the same verified cookie payload.
    const payload = await verifySessionToken(token);
    return await withDbTimeout(
      prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, email: true, createdAt: true }
      })
    );
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export { AUTH_COOKIE };
