import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function datePeriodFormatter(dateFrom, dateTo) {
  let result = "";
  if (dateFrom && dateTo) {
    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);
    result = `${dateFromObj.getDate()} ${dateFromObj.toLocaleString("uk-UA", { month: "short" })} - ${dateToObj.getDate()} ${dateToObj.toLocaleString("uk-UA", { month: "short" })} ${dateToObj.getFullYear()}`;
  }
  return result;
}

export function dateFormatter(date, format = "short") {
  const dateObj = new Date(date);
  if (format === "short")
    return `${dateObj.getDate()} ${dateObj.toLocaleString("uk-UA", { month: "short" })}`;
  if (format === "long")
    return `${dateObj.getDate()} ${dateObj.toLocaleString("uk-UA", { month: "long" })} ${dateObj.getFullYear()}`;
}
