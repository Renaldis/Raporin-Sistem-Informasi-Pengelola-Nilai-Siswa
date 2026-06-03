import { z } from "zod";

const scoreValueSchema = z.preprocess(
  (value) => {
    if (value === null || value === "") {
      return undefined;
    }

    return Number(value);
  },
  z
    .number({ required_error: "Nilai wajib diisi" })
    .int("Nilai harus berupa angka bulat")
    .min(0, "Nilai minimal 0")
    .max(100, "Nilai maksimal 100")
);

export const createScoreSchema = z.object({
  enrollmentId: z.string().min(1, "Siswa wajib dipilih"),
  teacherSubjectId: z.string().min(1, "Assignment mata pelajaran wajib dipilih"),
  taskScore: scoreValueSchema,
  utsScore: scoreValueSchema,
  uasScore: scoreValueSchema,
});

export const updateScoreSchema = createScoreSchema.extend({
  id: z.string().min(1, "ID nilai tidak valid"),
});

export const deleteScoreSchema = z.object({
  id: z.string().min(1, "ID nilai tidak valid"),
});
