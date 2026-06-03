import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PerPageSelect } from "@/components/per-page-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  perPage: number;
  totalItems: number;
  basePath: string;
  searchParams?: Record<string, string | number | undefined>;
};

export function Pagination({
  page,
  perPage,
  totalItems,
  basePath,
  searchParams = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * perPage + 1;
  const end = Math.min(safePage * perPage, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <p>
        Menampilkan <span className="font-medium text-foreground">{start}</span>-
        <span className="font-medium text-foreground">{end}</span> dari{" "}
        <span className="font-medium text-foreground">{totalItems}</span> data
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PerPageSelect value={perPage} />
        <div className="flex items-center gap-2">
        <Button asChild disabled={safePage <= 1} size="sm" variant="outline">
          <Link
            aria-disabled={safePage <= 1}
            className={cn(safePage <= 1 && "pointer-events-none opacity-50")}
            href={buildHref(basePath, searchParams, safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Link>
        </Button>
        <span className="min-w-20 text-center text-sm">
          {safePage} / {totalPages}
        </span>
        <Button
          asChild
          disabled={safePage >= totalPages}
          size="sm"
          variant="outline"
        >
          <Link
            aria-disabled={safePage >= totalPages}
            className={cn(safePage >= totalPages && "pointer-events-none opacity-50")}
            href={buildHref(basePath, searchParams, safePage + 1)}
          >
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        </div>
      </div>
    </div>
  );
}

function buildHref(
  basePath: string,
  currentParams: Record<string, string | number | undefined>,
  page: number
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(currentParams)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  params.set("page", String(Math.max(page, 1)));

  return `${basePath}?${params.toString()}`;
}
