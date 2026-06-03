"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { setActiveAcademicYearAction } from "@/actions/academic-year";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/action-result";

type SetActiveAcademicYearButtonProps = {
  academicYear: {
    id: string;
    isActive: boolean;
  };
};

export function SetActiveAcademicYearButton({
  academicYear,
}: SetActiveAcademicYearButtonProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    setActiveAcademicYearAction,
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

  if (academicYear.isActive) {
    return null;
  }

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={academicYear.id} />
      <Button disabled={isPending} size="sm" type="submit" variant="secondary">
        <CheckCircle2 className="h-4 w-4" />
        {isPending ? "Mengaktifkan..." : "Aktifkan"}
      </Button>
    </form>
  );
}
