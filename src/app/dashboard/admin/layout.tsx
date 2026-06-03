import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { requireRole } from "@/lib/permissions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("ADMIN");

  return (
    <DashboardLayout role="ADMIN" userName={user.username}>
      {children}
    </DashboardLayout>
  );
}
