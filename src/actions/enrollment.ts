"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createEnrollmentSchema,
  deleteEnrollmentSchema,
  updateEnrollmentSchema,
} from "@/schemas/enrollment";
import type { ActionResult } from "@/types/action-result";

const ENROLLMENTS_PATH = "/dashboard/admin/enrollments";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";
const STUDENT_DASHBOARD_PATH = "/dashboard/student";

export async function createEnrollmentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createEnrollmentSchema.safeParse({
    studentId: formData.get("studentId"),
    classRoomId: formData.get("classRoomId"),
    academicYearId: formData.get("academicYearId"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.studentClassEnrollment.create({
      data: parsed.data,
    });

    revalidateEnrollmentPaths();

    return {
      success: true,
      message: "Enrollment siswa berhasil ditambahkan",
    };
  } catch (error) {
    return handleEnrollmentError(error);
  }
}

export async function updateEnrollmentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateEnrollmentSchema.safeParse({
    id: formData.get("id"),
    studentId: formData.get("studentId"),
    classRoomId: formData.get("classRoomId"),
    academicYearId: formData.get("academicYearId"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.studentClassEnrollment.update({
      where: { id: parsed.data.id },
      data: {
        studentId: parsed.data.studentId,
        classRoomId: parsed.data.classRoomId,
        academicYearId: parsed.data.academicYearId,
      },
    });

    revalidateEnrollmentPaths();

    return {
      success: true,
      message: "Enrollment siswa berhasil diperbarui",
    };
  } catch (error) {
    return handleEnrollmentError(error);
  }
}

export async function deleteEnrollmentAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteEnrollmentSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.studentClassEnrollment.delete({
      where: { id: parsed.data.id },
    });

    revalidateEnrollmentPaths();

    return {
      success: true,
      message: "Enrollment siswa berhasil dihapus",
    };
  } catch (error) {
    return handleEnrollmentError(error);
  }
}

function revalidateEnrollmentPaths() {
  revalidatePath(ENROLLMENTS_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
  revalidatePath(STUDENT_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleEnrollmentError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Siswa sudah terdaftar pada tahun ajaran tersebut",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Siswa, kelas, atau tahun ajaran tidak valid",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Enrollment siswa tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses enrollment siswa",
  };
}
