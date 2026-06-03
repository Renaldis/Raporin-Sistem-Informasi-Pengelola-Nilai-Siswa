"use client";

import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteStudentAction } from "@/actions/student";
import {
  AlertDialog,
  AlertDialogAction,
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

type StudentDeleteDialogProps = {
  student: {
    id: string;
    name: string;
    nis: string;
  };
};

export function StudentDeleteDialog({ student }: StudentDeleteDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    deleteStudentAction,
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
          <AlertDialogTitle>Hapus data siswa?</AlertDialogTitle>
          <AlertDialogDescription>
            Data siswa {student.name} dengan NIS {student.nis} akan dihapus.
            Aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input name="id" type="hidden" value={student.id} />
            <AlertDialogAction asChild>
              <Button disabled={isPending} type="submit" variant="destructive">
                {isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
