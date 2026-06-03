"use client";

import { useActionState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteClassRoomAction } from "@/actions/class-room";
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

type ClassRoomDeleteDialogProps = {
  classRoom: {
    id: string;
    name: string;
  };
};

export function ClassRoomDeleteDialog({ classRoom }: ClassRoomDeleteDialogProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    deleteClassRoomAction,
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
          <AlertDialogTitle>Hapus data kelas?</AlertDialogTitle>
          <AlertDialogDescription>
            Data kelas {classRoom.name} akan dihapus. Aksi ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input name="id" type="hidden" value={classRoom.id} />
            <Button disabled={isPending} type="submit" variant="destructive">
                {isPending ? "Menghapus..." : "Hapus"}
              </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
