import { z } from "zod";

export const createTeacherSubjectSchema = z.object({
  teacherId: z.string().min(1, "Guru wajib dipilih"),
  subjectId: z.string().min(1, "Mata pelajaran wajib dipilih"),
});

export const updateTeacherSubjectSchema = createTeacherSubjectSchema.extend({
  id: z.string().min(1, "ID assignment tidak valid"),
});

export const deleteTeacherSubjectSchema = z.object({
  id: z.string().min(1, "ID assignment tidak valid"),
});
