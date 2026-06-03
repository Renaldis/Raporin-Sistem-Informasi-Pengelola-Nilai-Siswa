"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createAcademicYearAction,
  updateAcademicYearAction,
} from "@/actions/academic-year";
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
import type { ActionResult } from "@/types/action-result";

type AcademicYearFormDialogProps = {
  mode: "create" | "update";
  academicYear?: {
    id: string;
    name: string;
  };
};

export function AcademicYearFormDialog({
  mode,
  academicYear,
}: AcademicYearFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action =
    mode === "create" ? createAcademicYearAction : updateAcademicYearAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Tahun Ajaran",
            description: "Buat data tahun ajaran baru.",
            trigger: "Tambah Tahun Ajaran",
            submit: "Simpan",
          }
        : {
            title: "Edit Tahun Ajaran",
            description: "Perbarui nama tahun ajaran.",
            trigger: "Edit",
            submit: "Simpan Perubahan",
          },
    [mode]
  );

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
        <Button size={mode === "create" ? "default" : "sm"} variant={mode === "create" ? "default" : "outline"}>
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
          {academicYear ? (
            <input name="id" type="hidden" value={academicYear.id} />
          ) : null}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama Tahun Ajaran</Label>
            <Input
              defaultValue={academicYear?.name}
              id={`${mode}-name`}
              name="name"
              placeholder="2025/2026"
              required
            />
          </div>
          {state?.message && !state.success ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              <Save className="h-4 w-4" />
              {isPending ? "Menyimpan..." : copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
