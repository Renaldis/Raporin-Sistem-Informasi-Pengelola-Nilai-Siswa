"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createStudentAction,
  updateStudentAction,
} from "@/actions/student";
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

type StudentFormDialogProps = {
  mode: "create" | "update";
  student?: {
    id: string;
    nis: string;
    name: string;
    username: string;
  };
};

export function StudentFormDialog({ mode, student }: StudentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createStudentAction : updateStudentAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Siswa",
            description: "Buat data siswa dan akun login role siswa.",
            trigger: "Tambah Siswa",
            submit: "Simpan",
          }
        : {
            title: "Edit Siswa",
            description:
              "Perbarui data siswa. Kosongkan password jika tidak ingin mengganti password.",
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
          {student ? <input name="id" type="hidden" value={student.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-nis`}>NIS</Label>
              <Input
                defaultValue={student?.nis}
                id={`${mode}-nis`}
                name="nis"
                placeholder="20240001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-username`}>Username</Label>
              <Input
                defaultValue={student?.username}
                id={`${mode}-username`}
                name="username"
                placeholder="20240001"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama Siswa</Label>
            <Input
              defaultValue={student?.name}
              id={`${mode}-name`}
              name="name"
              placeholder="Nama lengkap siswa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>
              {mode === "create" ? "Password Awal" : "Password Baru"}
            </Label>
            <Input
              id={`${mode}-password`}
              minLength={mode === "create" ? 6 : undefined}
              name="password"
              placeholder={mode === "create" ? "Minimal 6 karakter" : "Opsional"}
              required={mode === "create"}
              type="password"
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
