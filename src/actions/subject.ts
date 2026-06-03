"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createSubjectSchema,
  deleteSubjectSchema,
  updateSubjectSchema,
} from "@/schemas/subject";
import type { ActionResult } from "@/types/action-result";

const SUBJECTS_PATH = "/dashboard/admin/subjects";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createSubjectSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.subject.create({
      data: parsed.data,
    });

    revalidateSubjectPaths();

    return {
      success: true,
      message: "Data mata pelajaran berhasil ditambahkan",
    };
  } catch (error) {
    return handleSubjectError(error);
  }
}

export async function updateSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateSubjectSchema.safeParse({
    id: formData.get("id"),
    code: formData.get("code"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.subject.update({
      where: { id: parsed.data.id },
      data: {
        code: parsed.data.code,
        name: parsed.data.name,
      },
    });

    revalidateSubjectPaths();

    return {
      success: true,
      message: "Data mata pelajaran berhasil diperbarui",
    };
  } catch (error) {
    return handleSubjectError(error);
  }
}

export async function deleteSubjectAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteSubjectSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.subject.delete({
      where: { id: parsed.data.id },
    });

    revalidateSubjectPaths();

    return {
      success: true,
      message: "Data mata pelajaran berhasil dihapus",
    };
  } catch (error) {
    return handleSubjectError(error);
  }
}

function revalidateSubjectPaths() {
  revalidatePath(SUBJECTS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleSubjectError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Kode mata pelajaran sudah digunakan",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Data mata pelajaran masih digunakan oleh assignment guru",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Data mata pelajaran tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses data mata pelajaran",
  };
}
