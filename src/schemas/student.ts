import { z } from "zod";

export const createStudentSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi"),
  name: z.string().min(1, "Nama siswa wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const updateStudentSchema = z.object({
  id: z.string().min(1, "ID siswa tidak valid"),
  nis: z.string().min(1, "NIS wajib diisi"),
  name: z.string().min(1, "Nama siswa wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z
    .string()
    .transform((value) => value.trim())
    .optional(),
});

export const deleteStudentSchema = z.object({
  id: z.string().min(1, "ID siswa tidak valid"),
});
