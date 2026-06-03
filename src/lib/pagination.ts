import {
  DEFAULT_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "@/constants/pagination";

export function getPositiveNumber(value: string | undefined, fallback: number) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return number;
}

export function getPerPage(value: string | undefined) {
  const perPage = getPositiveNumber(value, DEFAULT_PER_PAGE);

  if (!PER_PAGE_OPTIONS.includes(perPage as (typeof PER_PAGE_OPTIONS)[number])) {
    return DEFAULT_PER_PAGE;
  }

  return perPage;
}
