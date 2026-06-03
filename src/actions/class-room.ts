"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  createClassRoomSchema,
  deleteClassRoomSchema,
  updateClassRoomSchema,
} from "@/schemas/class-room";
import type { ActionResult } from "@/types/action-result";

const CLASSES_PATH = "/dashboard/admin/classes";
const ADMIN_DASHBOARD_PATH = "/dashboard/admin";

export async function createClassRoomAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = createClassRoomSchema.safeParse({
    name: formData.get("name"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.classRoom.create({
      data: parsed.data,
    });

    revalidateClassRoomPaths();

    return {
      success: true,
      message: "Data kelas berhasil ditambahkan",
    };
  } catch (error) {
    return handleClassRoomError(error);
  }
}

export async function updateClassRoomAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = updateClassRoomSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.classRoom.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        level: parsed.data.level,
      },
    });

    revalidateClassRoomPaths();

    return {
      success: true,
      message: "Data kelas berhasil diperbarui",
    };
  } catch (error) {
    return handleClassRoomError(error);
  }
}

export async function deleteClassRoomAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("ADMIN");

  const parsed = deleteClassRoomSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return getValidationError(parsed.error);
  }

  try {
    await prisma.classRoom.delete({
      where: { id: parsed.data.id },
    });

    revalidateClassRoomPaths();

    return {
      success: true,
      message: "Data kelas berhasil dihapus",
    };
  } catch (error) {
    return handleClassRoomError(error);
  }
}

function revalidateClassRoomPaths() {
  revalidatePath(CLASSES_PATH);
  revalidatePath(ADMIN_DASHBOARD_PATH);
}

function getValidationError(error: { errors: Array<{ message: string }> }) {
  return {
    success: false,
    message: error.errors[0]?.message ?? "Input tidak valid",
  };
}

function handleClassRoomError(error: unknown): ActionResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "Nama kelas sudah digunakan",
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: "Data kelas masih digunakan oleh enrollment siswa",
      };
    }

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Data kelas tidak ditemukan",
      };
    }
  }

  return {
    success: false,
    message: "Terjadi kesalahan saat memproses data kelas",
  };
}
