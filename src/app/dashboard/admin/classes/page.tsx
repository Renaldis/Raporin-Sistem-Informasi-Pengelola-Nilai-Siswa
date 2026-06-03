import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminClassesPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Kelas" },
      ]}
      description="Kelola data kelas dan level kelas."
      title="Kelola Kelas"
    />
  );
}
