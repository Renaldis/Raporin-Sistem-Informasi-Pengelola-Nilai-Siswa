import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { routeLabels } from "@/constants/design-system";

type BreadcrumbsProps = {
  items?: Array<{
    label: string;
    href?: string;
  }>;
  pathname?: string;
};

function buildItemsFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      label: routeLabels[segment] ?? segment,
      href: index === segments.length - 1 ? undefined : href,
    };
  });
}

export function Breadcrumbs({ items, pathname }: BreadcrumbsProps) {
  const breadcrumbs = items ?? (pathname ? buildItemsFromPathname(pathname) : []);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li className="flex items-center gap-1" key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight className="h-4 w-4" /> : null}
              {item.href && !isLast ? (
                <Link className="transition-colors hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-foreground" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
