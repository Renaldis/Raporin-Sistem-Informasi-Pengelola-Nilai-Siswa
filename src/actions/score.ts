"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  calculateFinalScore,
  determineGraduationStatus,
  validateScore,
} from "@/lib/score";
import {
  createScoreSchema,
  deleteScoreSchema,
  updateScoreSchema,
} from "@/schemas/score";
import type { ActionResult } from "@/types/action-result";

const TEACHER_SCORES_PATH = "/dashboard/teacher/scores";
const TEACHER_DASHBOARD_PATH = "/dashboard/teacher";
const STUDENT_DASHBOARD_PATH = "/dashboard/student";

export async function createScoreAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const teacher = await requireCurrentTeacher();
  const parsed = createScoreSchema.safeParse({
    enrollmentId: formData.get("enrollmentId"),
    teacherSubjectId: formData.get("teacherSubjectId"),
    taskScore: formData.get("taskScore"),
    utsScore: formData.get("utsScore"),
    uasScore: formData.get("uasScore"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  const scoreValidationError = validateScoreValues(
    parsed.data.taskScore,
    parsed.data.utsScore,
    parsed.data.uasScore
  );

  if (scoreValidationError) {
    return scoreValidationError;
  }

  const ownershipError = await validateTeacherSubjectOwnership(
    parsed.data.teacherSubjectId,
    teacher.id
  );

  if (ownershipError) {
    return ownershipError;
  }

  const finalScore = calculateFinalScore(
    parsed.data.taskScore,
    parsed.data.utsScore,
    parsed.data.uasScore
  );

  try {
    await prisma.score.create({
      data: {
        ...parsed.data,
        finalScore,
        status: determineGraduationStatus(finalScore),
      },
    });

    revalidateScorePaths();

    return {
      success: true,
      message: "Nilai siswa berhasil ditambahkan",
    };
  } catch (error) {
    return handleScoreError(error);
  }
}

export async function updateScoreAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const teacher = await requireCurrentTeacher();
  const parsed = updateScoreSchema.safeParse({
    id: formData.get("id"),
    enrollmentId: formData.get("enrollmentId"),
    teacherSubjectId: formData.get("teacherSubjectId"),
    taskScore: formData.get("taskScore"),
    utsScore: formData.get("utsScore"),
    uasScore: formData.get("uasScore"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  const scoreValidationError = validateScoreValues(
    parsed.data.taskScore,
    parsed.data.utsScore,
    parsed.data.uasScore
  );

  if (scoreValidationError) {
    return scoreValidationError;
  }

  const existingScore = await prisma.score.findFirst({
    where: {
      id: parsed.data.id,
      teacherSubject: {
        teacherId: teacher.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingScore) {
    return {
      success: false,
      message: "Nilai tidak ditemukan atau bukan milik assignment Anda",
    };
  }

  const ownershipError = await validateTeacherSubjectOwnership(
    parsed.data.teacherSubjectId,
    teacher.id
  );

  if (ownershipError) {
    return ownershipError;
  }

  const finalScore = calculateFinalScore(
    parsed.data.taskScore,
    parsed.data.utsScore,
    parsed.data.uasScore
  );

  try {
    await prisma.score.update({
      where: { id: parsed.data.id },
      data: {
        enrollmentId: parsed.data.enrollmentId,
        teacherSubjectId: parsed.data.teacherSubjectId,
        taskScore: parsed.data.taskScore,
        utsScore: parsed.data.utsScore,
        uasScore: parsed.data.uasScore,
        finalScore,
        status: determineGraduationStatus(finalScore),
      },
    });

    revalidateScorePaths();

    return {
      success: true,
      message: "Nilai siswa berhasil diperbarui",
    };
  } catch (error) {
    return handleScoreError(error);
  }
}

export async function deleteScoreAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const teacher = await requireCurrentTeacher();
  const parsed = deleteScoreSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  const existingScore = await prisma.score.findFirst({
    where: {
      id: parsed.data.id,
      teacherSubject: {
        teacherId: teacher.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingScore) {
    return {
      success: false,
      message: "Nilai tidak ditemukan atau bukan milik assignment Anda",
    };
  }

  try {
    await prisma.score.delete({
      where: { id: parsed.data.id },
    });

    revalidateScorePaths();

    return {
      success: true,
      message: "Nilai siswa berhasil dihapus",
    };
  } catch (error) {
    return handleScoreError(error);
  }
}

async function requireCurrentTeacher() {
  const user = await requireRole("TEACHER");
  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  return teacher;
}

async function validateTeacherSubjectOwnership(
  teacherSubjectId: string,
  teacherId: string
): Promise<ActionResult | null> {
  const teacherSubject = await prisma.teacherSubject.findFirst({
    where: {
      id: teacherSubjectId,
      teacherId,
    },
    select: {
      id: true,
    },
  });

  if (!teacherSubject) {
    return {
      success: false,
      message: "Assignment mata pelajaran tidak ditemukan untuk guru ini",
    };
  }

  return null;
}

function validateScoreValues(
  taskScore: number,
  utsScore: number,
  uasScore: number
): ActionResult | null {
  if (
    validateScore(taskScore) &&
    validateScore(utsScore) &&
    validateScore(uasScore)
  ) {
    return null;
  }

  return {
    success: false,
    message: "Nilai tugas, UTS, dan UAS harus berupa angka 0 sampai 100",
  };
}

function revalidateScorePaths() {
  revalidatePath(TEACHER_SCORES_PATH);
  revalidatePath(TEACHER_DASHBOARD_PATH);
  revalidatePath(STUDENT_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleScoreError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Nilai untuk siswa dan mata pelajaran tersebut sudah ada",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Siswa atau assignment mata pelajaran tidak valid",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Nilai siswa tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses nilai siswa",
  };
}
