import { ModulePlaceholder } from "@/components/module-placeholder";

export default function AdminTeachersPage() {
  return (
    <ModulePlaceholder
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Admin" },
        { label: "Guru" },
      ]}
      description="Kelola data guru, akun login, kode guru, dan nama guru."
      title="Kelola Guru"
    />
  );
}
