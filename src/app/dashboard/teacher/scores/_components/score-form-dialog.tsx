"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createScoreAction,
  updateScoreAction,
} from "@/actions/score";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActionResult } from "@/types/action-result";

type EnrollmentOption = {
  id: string;
  studentName: string;
  studentNis: string;
  classRoomName: string;
  academicYearName: string;
};

type TeacherSubjectOption = {
  id: string;
  subjectCode: string;
  subjectName: string;
};

type ScoreFormDialogProps = {
  mode: "create" | "update";
  enrollments: EnrollmentOption[];
  teacherSubjects: TeacherSubjectOption[];
  score?: {
    id: string;
    enrollmentId: string;
    teacherSubjectId: string;
    taskScore: number;
    utsScore: number;
    uasScore: number;
  };
};

export function ScoreFormDialog({
  mode,
  enrollments,
  teacherSubjects,
  score,
}: ScoreFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createScoreAction : updateScoreAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Input Nilai",
            description:
              "Pilih siswa dan mata pelajaran, lalu isi nilai tugas, UTS, dan UAS.",
            trigger: "Input Nilai",
            submit: "Simpan",
          }
        : {
            title: "Edit Nilai",
            description:
              "Perbarui nilai siswa. Nilai akhir dan status akan dihitung otomatis.",
            trigger: "Edit",
            submit: "Simpan Perubahan",
          },
    [mode]
  );

  const isDisabled = enrollments.length === 0 || teacherSubjects.length === 0;

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
          {score ? <input name="id" type="hidden" value={score.id} /> : null}
          <div className="space-y-2">
            <Label>Siswa</Label>
            <Select
              defaultValue={score?.enrollmentId}
              name="enrollmentId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih siswa" />
              </SelectTrigger>
              <SelectContent>
                {enrollments.map((enrollment) => (
                  <SelectItem key={enrollment.id} value={enrollment.id}>
                    {enrollment.studentNis} - {enrollment.studentName} |{" "}
                    {enrollment.classRoomName} | {enrollment.academicYearName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Select
              defaultValue={score?.teacherSubjectId}
              name="teacherSubjectId"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                {teacherSubjects.map((teacherSubject) => (
                  <SelectItem key={teacherSubject.id} value={teacherSubject.id}>
                    {teacherSubject.subjectCode} - {teacherSubject.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-task-score`}>Nilai Tugas</Label>
              <Input
                defaultValue={score?.taskScore}
                id={`${mode}-task-score`}
                max={100}
                min={0}
                name="taskScore"
                placeholder="0-100"
                required
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-uts-score`}>Nilai UTS</Label>
              <Input
                defaultValue={score?.utsScore}
                id={`${mode}-uts-score`}
                max={100}
                min={0}
                name="utsScore"
                placeholder="0-100"
                required
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-uas-score`}>Nilai UAS</Label>
              <Input
                defaultValue={score?.uasScore}
                id={`${mode}-uas-score`}
                max={100}
                min={0}
                name="uasScore"
                placeholder="0-100"
                required
                type="number"
              />
            </div>
          </div>
          {isDisabled ? (
            <p className="text-sm text-destructive">
              Data enrollment dan assignment mata pelajaran harus tersedia.
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
