"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectFilterProps = {
  label: string;
  paramName: string;
  placeholder?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

const ALL_VALUE = "__all";

export function SelectFilter({
  label,
  paramName,
  placeholder = "Semua",
  options,
}: SelectFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const value = searchParams.get(paramName) ?? ALL_VALUE;

  function onValueChange(nextValue: string) {
    const params = new URLSearchParams(searchParams);

    if (nextValue === ALL_VALUE) {
      params.delete(paramName);
    } else {
      params.set(paramName, nextValue);
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select disabled={isPending} onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
