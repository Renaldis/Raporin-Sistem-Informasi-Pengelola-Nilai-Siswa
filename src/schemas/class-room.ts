import { z } from "zod";

export const createClassRoomSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  level: z.string().min(1, "Level kelas wajib diisi"),
});

export const updateClassRoomSchema = createClassRoomSchema.extend({
  id: z.string().min(1, "ID kelas tidak valid"),
});

export const deleteClassRoomSchema = z.object({
  id: z.string().min(1, "ID kelas tidak valid"),
});
