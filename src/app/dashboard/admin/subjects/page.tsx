import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminSubjectsPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Mata Pelajaran" },
      ]}
      description="Kelola kode dan nama mata pelajaran."
      title="Kelola Mata Pelajaran"
    />
  );
}
