import { z } from "zod";

const academicYearNameSchema = z
  .string()
  .min(1, "Nama tahun ajaran wajib diisi")
  .regex(/^\d{4}\/\d{4}$/, "Format tahun ajaran harus seperti 2025/2026")
  .refine((value) => {
    const [startYear, endYear] = value.split("/").map(Number);
    return endYear === startYear + 1;
  }, "Tahun akhir harus satu tahun setelah tahun awal");

export const createAcademicYearSchema = z.object({
  name: academicYearNameSchema,
});

export const updateAcademicYearSchema = createAcademicYearSchema.extend({
  id: z.string().min(1, "ID tahun ajaran tidak valid"),
});

export const setActiveAcademicYearSchema = z.object({
  id: z.string().min(1, "ID tahun ajaran tidak valid"),
});
