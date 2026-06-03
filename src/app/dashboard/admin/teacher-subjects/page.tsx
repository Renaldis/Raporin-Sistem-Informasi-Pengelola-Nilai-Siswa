import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminTeacherSubjectsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Guru-Mapel" },
      ]}
      description="Kelola assignment guru dan mata pelajaran."
      title="Assignment Guru-Mapel"
    />
  );
}
