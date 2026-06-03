"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import {
  createClassRoomAction,
  updateClassRoomAction,
} from "@/actions/class-room";
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

type ClassRoomFormDialogProps = {
  mode: "create" | "update";
  classRoom?: {
    id: string;
    name: string;
    level: string;
  };
};

export function ClassRoomFormDialog({
  mode,
  classRoom,
}: ClassRoomFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action =
    mode === "create" ? createClassRoomAction : updateClassRoomAction;
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  const copy = useMemo(
    () =>
      mode === "create"
        ? {
            title: "Tambah Kelas",
            description: "Buat data kelas baru untuk enrollment siswa.",
            trigger: "Tambah Kelas",
            submit: "Simpan",
          }
        : {
            title: "Edit Kelas",
            description: "Perbarui nama kelas dan level kelas.",
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
          {classRoom ? (
            <input name="id" type="hidden" value={classRoom.id} />
          ) : null}
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Nama Kelas</Label>
            <Input
              defaultValue={classRoom?.name}
              id={`${mode}-name`}
              name="name"
              placeholder="X RPL 1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-level`}>Level</Label>
            <Input
              defaultValue={classRoom?.level}
              id={`${mode}-level`}
              name="level"
              placeholder="X"
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
