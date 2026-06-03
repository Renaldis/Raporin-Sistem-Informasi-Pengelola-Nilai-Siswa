import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

type ModulePlaceholderProps = {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
};

export function ModulePlaceholder({
  title,
  description,
  breadcrumbs,
}: ModulePlaceholderProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        description={description}
        title={title}
      />
      <EmptyState
        description="Modul ini sudah disiapkan sebagai route MVP dan akan diisi dengan table, form dialog, validasi, dan server action sesuai task breakdown."
        title="Implementasi modul berikutnya"
      />
    </>
  );
}
