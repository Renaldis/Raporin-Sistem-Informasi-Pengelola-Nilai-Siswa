import { z } from "zod";

export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  classRoomId: z.string().min(1, "Kelas wajib dipilih"),
  academicYearId: z.string().min(1, "Tahun ajaran wajib dipilih"),
});

export const updateEnrollmentSchema = createEnrollmentSchema.extend({
  id: z.string().min(1, "ID enrollment tidak valid"),
});

export const deleteEnrollmentSchema = z.object({
  id: z.string().min(1, "ID enrollment tidak valid"),
});
