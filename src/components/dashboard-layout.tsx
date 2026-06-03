import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dashboardNavigation } from "@/constants/design-system";
import type { Role } from "@prisma/client";

type DashboardLayoutProps = {
  role: Role;
  userName: string;
  children: ReactNode;
};

export function DashboardLayout({
  role,
  userName,
  children,
}: DashboardLayoutProps) {
  const navigation = dashboardNavigation[role];

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center px-6">
          <Link className="text-lg font-semibold" href="/">
            Raporin
          </Link>
        </div>
        <Separator />
        <nav className="space-y-1 p-4">
          {navigation.map((item) => (
            <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              href={item.href}
              key={item.href}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button className="lg:hidden" size="icon" variant="ghost">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Buka menu</span>
            </Button>
            <span className="font-semibold lg:hidden">Raporin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName}
            </span>
            <form action={logoutAction}>
              <Button size="sm" type="submit" variant="outline">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
