import { z } from "zod";

export const createTeacherSchema = z.object({
  teacherCode: z.string().min(1, "Kode guru wajib diisi"),
  name: z.string().min(1, "Nama guru wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateTeacherSchema = z.object({
  id: z.string().min(1, "ID guru tidak valid"),
  teacherCode: z.string().min(1, "Kode guru wajib diisi"),
  name: z.string().min(1, "Nama guru wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z
    .string()
    .transform((value) => value.trim())
    .optional(),
});

export const deleteTeacherSchema = z.object({
  id: z.string().min(1, "ID guru tidak valid"),
});
