"use client";

import { type FormEvent, useState } from "react";
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

type TeacherDeleteDialogProps = {
  teacher: {
    id: string;
    name: string;
    teacherCode: string;
  };
};

export function TeacherDeleteDialog({ teacher }: TeacherDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const result = await deleteTeacherAction(
        null,
        new FormData(event.currentTarget)
      );

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        return;
      }

      toast.error(result.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
          <form onSubmit={handleSubmit}>
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
