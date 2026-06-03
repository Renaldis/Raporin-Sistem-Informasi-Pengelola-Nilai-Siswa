import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-blue-900/30 bg-blue-950 text-blue-50 lg:block">
        <SidebarContent role={role} />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-blue-100 bg-white/90 px-4 shadow-sm backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="lg:hidden" size="icon" variant="outline">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="border-blue-900/30 bg-blue-950 p-0 text-blue-50">
                <SidebarContent isMobile role={role} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                R
              </div>
              <span className="font-semibold text-blue-950">Raporin</span>
            </div>
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

function SidebarContent({
  role,
  isMobile = false,
}: {
  role: Role;
  isMobile?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500 text-sm font-bold text-white shadow-sm">
          R
        </div>
        <div>
          <Link className="text-lg font-semibold" href="/">
            Raporin
          </Link>
          <p className="text-xs text-blue-200">Pengolahan Nilai Siswa</p>
        </div>
      </div>
      <Separator className="bg-blue-900/70" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SidebarNav isMobile={isMobile} role={role} />
      </div>
      <div className="border-t border-blue-900/70 p-4">
        <div className="rounded-lg bg-blue-900/60 p-3">
          <p className="text-xs font-medium text-blue-200">Login sebagai</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {role === "ADMIN" ? "Admin" : role === "TEACHER" ? "Guru" : "Siswa"}
          </p>
        </div>
      </div>
    </div>
  );
}
