"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "@/constants/pagination";

type PerPageSelectProps = {
  value: number;
  paramName?: string;
};

export function PerPageSelect({
  value,
  paramName = "perPage",
}: PerPageSelectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onValueChange(nextValue: string) {
    const params = new URLSearchParams(searchParams);
    const perPage = Number(nextValue);

    if (perPage === DEFAULT_PER_PAGE) {
      params.delete(paramName);
    } else {
      params.set(paramName, String(perPage));
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        Per halaman
      </span>
      <Select
        disabled={isPending}
        onValueChange={onValueChange}
        value={String(value)}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PER_PAGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
