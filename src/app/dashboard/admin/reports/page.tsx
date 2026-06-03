import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminReportsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Laporan" },
      ]}
      description="Rekap nilai, filter kelas/mapel/tahun ajaran, dan export CSV."
      title="Laporan Nilai"
    />
  );
}
