import { z } from "zod";

export const createAcademicYearSchema = z.object({
  name: z.string().min(1, "Nama tahun ajaran wajib diisi"),
});

export const updateAcademicYearSchema = createAcademicYearSchema.extend({
  id: z.string().min(1, "ID tahun ajaran tidak valid"),
});

export const setActiveAcademicYearSchema = z.object({
  id: z.string().min(1, "ID tahun ajaran tidak valid"),
});
