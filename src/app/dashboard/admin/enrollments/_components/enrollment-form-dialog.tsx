"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createEnrollmentAction,
  updateEnrollmentAction,
} from "@/actions/enrollment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionResult } from "@/types/action-result";

type StudentOption = {
  id: string;
  nis: string;
  name: string;
};

type ClassRoomOption = {
  id: string;
  name: string;
  level: string;
};

type AcademicYearOption = {
  id: string;
  name: string;
  isActive: boolean;
};

type EnrollmentFormDialogProps = {
  mode: "create" | "update";
  students: StudentOption[];
  classRooms: ClassRoomOption[];
  academicYears: AcademicYearOption[];
  enrollment?: {
    id: string;
    studentId: string;
    classRoomId: string;
    academicYearId: string;
  };
};

export function EnrollmentFormDialog({
  mode,
  students,
  classRooms,
  academicYears,
  enrollment,
}: EnrollmentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action =
    mode === "create" ? createEnrollmentAction : updateEnrollmentAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Enrollment",
            description: "Tempatkan siswa ke kelas pada tahun ajaran tertentu.",
            trigger: "Tambah Enrollment",
            submit: "Simpan",
          }
        : {
            title: "Edit Enrollment",
            description: "Perbarui penempatan siswa, kelas, atau tahun ajaran.",
            trigger: "Edit",
            submit: "Simpan Perubahan",
          },
    [mode]
  );

  const isDisabled =
    students.length === 0 || classRooms.length === 0 || academicYears.length === 0;

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      setOpen(false);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={mode === "create" && isDisabled}
          size={mode === "create" ? "default" : "sm"}
          variant={mode === "create" ? "default" : "outline"}
        >
          {mode === "create" ? <Plus className="h-4 w-4" /> : null}
          {copy.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {enrollment ? (
            <input name="id" type="hidden" value={enrollment.id} />
          ) : null}
          <div className="space-y-2">
            <Label>Siswa</Label>
            <Select
              defaultValue={enrollment?.studentId}
              name="studentId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.nis} - {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kelas</Label>
            <Select
              defaultValue={enrollment?.classRoomId}
              name="classRoomId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classRooms.map((classRoom) => (
                  <SelectItem key={classRoom.id} value={classRoom.id}>
                    {classRoom.name} - {classRoom.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tahun Ajaran</Label>
            <Select
              defaultValue={enrollment?.academicYearId}
              name="academicYearId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun ajaran" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((academicYear) => (
                  <SelectItem key={academicYear.id} value={academicYear.id}>
                    {academicYear.name}
                    {academicYear.isActive ? " - Aktif" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isDisabled ? (
            <p className="text-sm text-destructive">
              Data siswa, kelas, dan tahun ajaran harus tersedia terlebih dahulu.
            </p>
          ) : null}
          {state?.message && !state.success ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          <DialogFooter>
            <Button disabled={isPending || isDisabled} type="submit">
              <Save className="h-4 w-4" />
              {isPending ? "Menyimpan..." : copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
