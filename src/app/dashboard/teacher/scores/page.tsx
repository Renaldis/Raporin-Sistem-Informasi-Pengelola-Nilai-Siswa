import { ModulePlaceholder } from "@/components/module-placeholder";

export default function TeacherScoresPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/teacher" },
        { label: "Guru" },
        { label: "Nilai" },
      ]}
      description="Input, update, dan lihat nilai siswa sesuai assignment guru."
      title="Input Nilai"
    />
  );
}
