import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReportExportButtonProps = {
  searchParams: Record<string, string | number | undefined>;
};

export function ReportExportButton({ searchParams }: ReportExportButtonProps) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  return (
    <Button asChild>
      <Link href={`/api/reports/scores/export?${params.toString()}`}>
        <Download className="h-4 w-4" />
        Export CSV
      </Link>
    </Button>
  );
}
