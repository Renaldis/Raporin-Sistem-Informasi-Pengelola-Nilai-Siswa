"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

import { SheetClose } from "@/components/ui/sheet";
import { dashboardNavigation } from "@/constants/design-system";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  role: Role;
  isMobile?: boolean;
};

export function SidebarNav({ role, isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();
  const navigation = dashboardNavigation[role];

  return (
    <nav aria-label="Navigasi dashboard" className="space-y-1 p-4">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-blue-300">
        Menu Utama
      </p>
      {navigation.map((item) => {
        const isActive = isActiveRoute(pathname, item.href);
        const link = (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-blue-300",
              isActive
                ? "bg-blue-500/20 text-white shadow-sm"
                : "text-blue-100 hover:bg-blue-900 hover:text-white"
            )}
            href={item.href}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-colors",
                isActive ? "bg-blue-300" : "bg-transparent"
              )}
            />
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-blue-200" : "text-blue-300 group-hover:text-blue-100"
              )}
            />
            <span className="truncate">{item.title}</span>
          </Link>
        );

        if (!isMobile) {
          return <div key={item.href}>{link}</div>;
        }

        return (
          <SheetClose asChild key={item.href}>
            {link}
          </SheetClose>
        );
      })}
    </nav>
  );
}

function isActiveRoute(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (
    href === "/dashboard/admin" ||
    href === "/dashboard/teacher" ||
    href === "/dashboard/student"
  ) {
    return false;
  }

  return href !== "/" && pathname.startsWith(`${href}/`);
}
