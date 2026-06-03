"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createTeacherSubjectAction,
  updateTeacherSubjectAction,
} from "@/actions/teacher-subject";
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

type TeacherOption = {
  id: string;
  name: string;
  teacherCode: string;
};

type SubjectOption = {
  id: string;
  code: string;
  name: string;
};

type TeacherSubjectFormDialogProps = {
  mode: "create" | "update";
  teachers: TeacherOption[];
  subjects: SubjectOption[];
  teacherSubject?: {
    id: string;
    teacherId: string;
    subjectId: string;
  };
};

export function TeacherSubjectFormDialog({
  mode,
  teachers,
  subjects,
  teacherSubject,
}: TeacherSubjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action =
    mode === "create" ? createTeacherSubjectAction : updateTeacherSubjectAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Assignment",
            description: "Pilih guru dan mata pelajaran yang diajar.",
            trigger: "Tambah Assignment",
            submit: "Simpan",
          }
        : {
            title: "Edit Assignment",
            description: "Perbarui guru atau mata pelajaran assignment.",
            trigger: "Edit",
            submit: "Simpan Perubahan",
          },
    [mode]
  );

  const isDisabled = teachers.length === 0 || subjects.length === 0;

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
          {teacherSubject ? (
            <input name="id" type="hidden" value={teacherSubject.id} />
          ) : null}
          <div className="space-y-2">
            <Label>Guru</Label>
            <Select
              defaultValue={teacherSubject?.teacherId}
              name="teacherId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih guru" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.teacherCode} - {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Select
              defaultValue={teacherSubject?.subjectId}
              name="subjectId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isDisabled ? (
            <p className="text-sm text-destructive">
              Data guru dan mata pelajaran harus tersedia terlebih dahulu.
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
