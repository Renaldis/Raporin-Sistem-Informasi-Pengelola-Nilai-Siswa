"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createTeacherSchema,
  deleteTeacherSchema,
  updateTeacherSchema,
} from "@/schemas/teacher";
import type { ActionResult } from "@/types/action-result";

const TEACHERS_PATH = "/dashboard/admin/teachers";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createTeacherAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createTeacherSchema.safeParse({
    teacherCode: formData.get("teacherCode"),
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: parsed.data.username,
          password: hashedPassword,
          role: "TEACHER",
        },
      });

      await tx.teacher.create({
        data: {
          userId: user.id,
          teacherCode: parsed.data.teacherCode,
          name: parsed.data.name,
        },
      });
    });

    revalidateTeacherPaths();

    return {
      success: true,
      message: "Data guru berhasil ditambahkan",
    };
  } catch (error) {
    return handleTeacherError(error);
  }
}

export async function updateTeacherAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateTeacherSchema.safeParse({
    id: formData.get("id"),
    teacherCode: formData.get("teacherCode"),
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password") || undefined,
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.findUnique({
        where: { id: parsed.data.id },
        select: { userId: true },
      });

      if (!teacher) {
        throw new Error("TEACHER_NOT_FOUND");
      }

      const password = parsed.data.password?.trim();

      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          username: parsed.data.username,
          ...(password
            ? {
                password: await bcrypt.hash(password, 10),
              }
            : {}),
        },
      });

      await tx.teacher.update({
        where: { id: parsed.data.id },
        data: {
          teacherCode: parsed.data.teacherCode,
          name: parsed.data.name,
        },
      });
    });

    revalidateTeacherPaths();

    return {
      success: true,
      message: "Data guru berhasil diperbarui",
    };
  } catch (error) {
    return handleTeacherError(error);
  }
}

export async function deleteTeacherAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteTeacherSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.findUnique({
        where: { id: parsed.data.id },
        select: { userId: true },
      });

      if (!teacher) {
        throw new Error("TEACHER_NOT_FOUND");
      }

      await tx.teacher.delete({
        where: { id: parsed.data.id },
      });

      await tx.user.delete({
        where: { id: teacher.userId },
      });
    });

    revalidateTeacherPaths();

    return {
      success: true,
      message: "Data guru berhasil dihapus",
    };
  } catch (error) {
    return handleTeacherError(error);
  }
}

function revalidateTeacherPaths() {
  revalidatePath(TEACHERS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleTeacherError(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "TEACHER_NOT_FOUND") {
    return {
      success: false,
      message: "Data guru tidak ditemukan",
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : "data unik";

      return {
        success: false,
        message: `Data ${target} sudah digunakan`,
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Data guru masih digunakan oleh data lain",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses data guru",
  };
}
