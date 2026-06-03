"use client";

import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTeacherAction } from "@/actions/teacher";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

type TeacherDeleteDialogProps = {
  teacher: {
    id: string;
    name: string;
    teacherCode: string;
  };
};

export function TeacherDeleteDialog({ teacher }: TeacherDeleteDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    deleteTeacherAction,
    null
  );

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus data guru?</AlertDialogTitle>
          <AlertDialogDescription>
            Data guru {teacher.name} dengan kode {teacher.teacherCode} akan
            dihapus. Aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input name="id" type="hidden" value={teacher.id} />
            <Button disabled={isPending} type="submit" variant="destructive">
                {isPending ? "Menghapus..." : "Hapus"}
              </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
