"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createTeacherSubjectSchema,
  deleteTeacherSubjectSchema,
  updateTeacherSubjectSchema,
} from "@/schemas/teacher-subject";
import type { ActionResult } from "@/types/action-result";

const TEACHER_SUBJECTS_PATH = "/dashboard/admin/teacher-subjects";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createTeacherSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createTeacherSubjectSchema.safeParse({
    teacherId: formData.get("teacherId"),
    subjectId: formData.get("subjectId"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.teacherSubject.create({
      data: parsed.data,
    });

    revalidateTeacherSubjectPaths();

    return {
      success: true,
      message: "Assignment guru-mapel berhasil ditambahkan",
    };
  } catch (error) {
    return handleTeacherSubjectError(error);
  }
}

export async function updateTeacherSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateTeacherSubjectSchema.safeParse({
    id: formData.get("id"),
    teacherId: formData.get("teacherId"),
    subjectId: formData.get("subjectId"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.teacherSubject.update({
      where: { id: parsed.data.id },
      data: {
        teacherId: parsed.data.teacherId,
        subjectId: parsed.data.subjectId,
      },
    });

    revalidateTeacherSubjectPaths();

    return {
      success: true,
      message: "Assignment guru-mapel berhasil diperbarui",
    };
  } catch (error) {
    return handleTeacherSubjectError(error);
  }
}

export async function deleteTeacherSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteTeacherSubjectSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.teacherSubject.delete({
      where: { id: parsed.data.id },
    });

    revalidateTeacherSubjectPaths();

    return {
      success: true,
      message: "Assignment guru-mapel berhasil dihapus",
    };
  } catch (error) {
    return handleTeacherSubjectError(error);
  }
}

function revalidateTeacherSubjectPaths() {
  revalidatePath(TEACHER_SUBJECTS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleTeacherSubjectError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Kombinasi guru dan mata pelajaran sudah ada",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Guru atau mata pelajaran tidak valid",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Assignment guru-mapel tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses assignment guru-mapel",
  };
}
