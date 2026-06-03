import { Badge, type BadgeProps } from "@/components/ui/badge";
import { statusLabels } from "@/constants/design-system";

type StatusBadgeProps = {
  status: keyof typeof statusLabels | string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = getVariant(status);
  const label = statusLabels[status as keyof typeof statusLabels] ?? status;

  return <Badge variant={variant}>{label}</Badge>;
}

function getVariant(status: string): BadgeProps["variant"] {
  if (status === "PASSED" || status === "ACTIVE") {
    return "success";
  }

  if (status === "FAILED") {
    return "destructive";
  }

  if (status === "INACTIVE") {
    return "secondary";
  }

  return "outline";
}
