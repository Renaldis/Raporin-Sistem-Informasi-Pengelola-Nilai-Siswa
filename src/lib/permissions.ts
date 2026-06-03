import "server-only";

import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

import { getDashboardPath, getSessionUser } from "@/lib/auth";

export async function getCurrentUser() {
  return getSessionUser();
}

export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(role: Role) {
  const user = await requireAuth();

  if (user.role !== role) {
    redirect(getDashboardPath(user.role));
  }

  return user;
}

export function redirectByRole(role: Role) {
  redirect(getDashboardPath(role));
}
