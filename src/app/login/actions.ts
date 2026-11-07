"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";

export async function login(_prev: string | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const hash = process.env.APP_PASSWORD_HASH ?? "";
  const ok = hash !== "" && (await bcrypt.compare(password, hash));

  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return "Wrong password";
  }
  await createSession();
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}