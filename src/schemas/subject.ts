import { z } from "zod";

export const createSubjectSchema = z.object({
  code: z.string().min(1, "Kode mata pelajaran wajib diisi"),
  name: z.string().min(1, "Nama mata pelajaran wajib diisi"),
});

export const updateSubjectSchema = createSubjectSchema.extend({
  id: z.string().min(1, "ID mata pelajaran tidak valid"),
});

export const deleteSubjectSchema = z.object({
  id: z.string().min(1, "ID mata pelajaran tidak valid"),
});
