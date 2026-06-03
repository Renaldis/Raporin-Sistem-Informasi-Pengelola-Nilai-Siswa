"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createTeacherAction,
  updateTeacherAction,
} from "@/actions/teacher";
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

type TeacherFormDialogProps = {
  mode: "create" | "update";
  teacher?: {
    id: string;
    teacherCode: string;
    name: string;
    username: string;
  };
};

export function TeacherFormDialog({ mode, teacher }: TeacherFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = mode === "create" ? createTeacherAction : updateTeacherAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Guru",
            description: "Buat data guru dan akun login role guru.",
            trigger: "Tambah Guru",
            submit: "Simpan",
          }
        : {
            title: "Edit Guru",
            description:
              "Perbarui data guru. Kosongkan password jika tidak ingin mengganti password.",
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
          {teacher ? <input name="id" type="hidden" value={teacher.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-teacher-code`}>Kode Guru</Label>
              <Input
                defaultValue={teacher?.teacherCode}
                id={`${mode}-teacher-code`}
                name="teacherCode"
                placeholder="G001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${mode}-username`}>Username</Label>
              <Input
                defaultValue={teacher?.username}
                id={`${mode}-username`}
                name="username"
                placeholder="guru001"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama Guru</Label>
            <Input
              defaultValue={teacher?.name}
              id={`${mode}-name`}
              name="name"
              placeholder="Nama lengkap guru"
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
