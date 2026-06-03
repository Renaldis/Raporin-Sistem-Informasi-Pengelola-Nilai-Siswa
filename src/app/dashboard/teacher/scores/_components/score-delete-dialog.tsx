"use client";

import { type FormEvent, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteScoreAction } from "@/actions/score";
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

type ScoreDeleteDialogProps = {
  score: {
    id: string;
    studentName: string;
    subjectName: string;
  };
};

export function ScoreDeleteDialog({ score }: ScoreDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const result = await deleteScoreAction(
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
          <AlertDialogTitle>Hapus nilai?</AlertDialogTitle>
          <AlertDialogDescription>
            Nilai {score.studentName} untuk mata pelajaran {score.subjectName}{" "}
            akan dihapus. Aksi ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form onSubmit={handleSubmit}>
            <input name="id" type="hidden" value={score.id} />
            <Button disabled={isPending} type="submit" variant="destructive">
              {isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
