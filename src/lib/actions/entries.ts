"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries } from "@/lib/schema";
import { requireSession } from "@/lib/session";

export async function createEntry(content: string): Promise<{ error?: string }> {
  await requireSession();
  const text = content.trim();
  if (!text) return { error: "Write something first." };
  if (text.length > 20_000) return { error: "That's too long for one entry." };

  await db.insert(entries).values({ content: text });
  revalidatePath("/");
  return {};
}

export async function deleteEntry(id: number) {
  await requireSession();
  await db.delete(entries).where(eq(entries.id, id));
  revalidatePath("/");
}