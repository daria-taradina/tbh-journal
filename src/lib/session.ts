import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "tbh_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function createSession() {
  const token = await new SignJWT({ ok: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isLoggedIn() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}

export async function requireSession() {
  if (!(await isLoggedIn())) redirect("/login");
}