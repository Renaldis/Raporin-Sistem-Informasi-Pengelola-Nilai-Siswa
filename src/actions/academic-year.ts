"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createAcademicYearSchema,
  setActiveAcademicYearSchema,
  updateAcademicYearSchema,
} from "@/schemas/academic-year";
import type { ActionResult } from "@/types/action-result";

const ACADEMIC_YEARS_PATH = "/dashboard/admin/academic-years";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createAcademicYearAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createAcademicYearSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.academicYear.create({
      data: parsed.data,
    });

    revalidateAcademicYearPaths();

    return {
      success: true,
      message: "Data tahun ajaran berhasil ditambahkan",
    };
  } catch (error) {
    return handleAcademicYearError(error);
  }
}

export async function updateAcademicYearAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateAcademicYearSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.academicYear.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
      },
    });

    revalidateAcademicYearPaths();

    return {
      success: true,
      message: "Data tahun ajaran berhasil diperbarui",
    };
  } catch (error) {
    return handleAcademicYearError(error);
  }
}

export async function setActiveAcademicYearAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = setActiveAcademicYearSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.academicYear.updateMany({
        data: { isActive: false },
      });

      await tx.academicYear.update({
        where: { id: parsed.data.id },
        data: { isActive: true },
      });
    });

    revalidateAcademicYearPaths();

    return {
      success: true,
      message: "Tahun ajaran aktif berhasil diperbarui",
    };
  } catch (error) {
    return handleAcademicYearError(error);
  }
}

function revalidateAcademicYearPaths() {
  revalidatePath(ACADEMIC_YEARS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleAcademicYearError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Nama tahun ajaran sudah digunakan",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Data tahun ajaran tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses data tahun ajaran",
  };
}
