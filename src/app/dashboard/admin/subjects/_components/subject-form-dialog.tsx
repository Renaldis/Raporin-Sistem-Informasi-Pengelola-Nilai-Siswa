"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createSubjectAction,
  updateSubjectAction,
} from "@/actions/subject";
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

type SubjectFormDialogProps = {
  mode: "create" | "update";
  subject?: {
    id: string;
    code: string;
    name: string;
  };
};

export function SubjectFormDialog({ mode, subject }: SubjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createSubjectAction : updateSubjectAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Mata Pelajaran",
            description: "Buat data mata pelajaran baru.",
            trigger: "Tambah Mapel",
            submit: "Simpan",
          }
        : {
            title: "Edit Mata Pelajaran",
            description: "Perbarui kode dan nama mata pelajaran.",
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
          {subject ? <input name="id" type="hidden" value={subject.id} /> : null}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-code`}>Kode Mata Pelajaran</Label>
            <Input
              defaultValue={subject?.code}
              id={`${mode}-code`}
              name="code"
              placeholder="MTK"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama Mata Pelajaran</Label>
            <Input
              defaultValue={subject?.name}
              id={`${mode}-name`}
              name="name"
              placeholder="Matematika"
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
