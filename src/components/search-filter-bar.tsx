"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFilterBarProps = {
  searchPlaceholder?: string;
  searchParam?: string;
};

export function SearchFilterBar({
  searchPlaceholder = "Cari data...",
  searchParam = "search",
}: SearchFilterBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSearch = searchParams.get(searchParam) ?? "";

  function updateParams(formData: FormData) {
    const params = new URLSearchParams(searchParams);
    const search = String(formData.get(searchParam) ?? "").trim();

    if (search) {
      params.set(searchParam, search);
    } else {
      params.delete(searchParam);
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams);
    params.delete(searchParam);
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form
      action={updateParams}
      className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          defaultValue={currentSearch}
          name={searchParam}
          placeholder={searchPlaceholder}
        />
      </div>
      <div className="flex gap-2">
        {currentSearch ? (
          <Button
            disabled={isPending}
            onClick={clearSearch}
            type="button"
            variant="outline"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        ) : null}
        <Button disabled={isPending} type="submit">
          <Search className="h-4 w-4" />
          Cari
        </Button>
      </div>
    </form>
  );
}
