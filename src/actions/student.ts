"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createStudentSchema,
  deleteStudentSchema,
  updateStudentSchema,
} from "@/schemas/student";
import type { ActionResult } from "@/types/action-result";

const STUDENTS_PATH = "/dashboard/admin/students";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createStudentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createStudentSchema.safeParse({
    nis: formData.get("nis"),
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
          role: "STUDENT",
        },
      });

      await tx.student.create({
        data: {
          userId: user.id,
          nis: parsed.data.nis,
          name: parsed.data.name,
        },
      });
    });

    revalidateStudentPaths();

    return {
      success: true,
      message: "Data siswa berhasil ditambahkan",
    };
  } catch (error) {
    return handleStudentError(error);
  }
}

export async function updateStudentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateStudentSchema.safeParse({
    id: formData.get("id"),
    nis: formData.get("nis"),
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password") || undefined,
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id: parsed.data.id },
        select: { userId: true },
      });

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      const password = parsed.data.password?.trim();

      await tx.user.update({
        where: { id: student.userId },
        data: {
          username: parsed.data.username,
          ...(password
            ? {
                password: await bcrypt.hash(password, 10),
              }
            : {}),
        },
      });

      await tx.student.update({
        where: { id: parsed.data.id },
        data: {
          nis: parsed.data.nis,
          name: parsed.data.name,
        },
      });
    });

    revalidateStudentPaths();

    return {
      success: true,
      message: "Data siswa berhasil diperbarui",
    };
  } catch (error) {
    return handleStudentError(error);
  }
}

export async function deleteStudentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteStudentSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id: parsed.data.id },
        select: { userId: true },
      });

      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }

      await tx.student.delete({
        where: { id: parsed.data.id },
      });

      await tx.user.delete({
        where: { id: student.userId },
      });
    });

    revalidateStudentPaths();

    return {
      success: true,
      message: "Data siswa berhasil dihapus",
    };
  } catch (error) {
    return handleStudentError(error);
  }
}

function revalidateStudentPaths() {
  revalidatePath(STUDENTS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleStudentError(error: unknown): ActionResult {
  if (error instanceof Error && error.message === "STUDENT_NOT_FOUND") {
    return {
      success: false,
      message: "Data siswa tidak ditemukan",
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
        message: "Data siswa masih digunakan oleh data lain",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses data siswa",
  };
}
