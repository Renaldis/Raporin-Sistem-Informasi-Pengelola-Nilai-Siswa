import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { requireRole } from "@/lib/permissions";

export default async function TeacherDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("TEACHER");

  return (
    <DashboardLayout role="TEACHER" userName={user.username}>
      {children}
    </DashboardLayout>
  );
}
