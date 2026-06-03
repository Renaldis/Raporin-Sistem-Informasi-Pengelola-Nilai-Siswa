"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { createSession, destroySession, getDashboardPath } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth";
import type { ActionResult } from "@/types/action-result";

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message ?? "Input login tidak valid",
    };
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (!user) {
    return {
      success: false,
      message: "Username atau password salah",
    };
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.password);

  if (!isValidPassword) {
    return {
      success: false,
      message: "Username atau password salah",
    };
  }

  await createSession({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  redirect(getDashboardPath(user.role));
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
