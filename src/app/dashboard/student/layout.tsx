import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { requireRole } from "@/lib/permissions";

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("STUDENT");

  return (
    <DashboardLayout role="STUDENT" userName={user.username}>
      {children}
    </DashboardLayout>
  );
}
