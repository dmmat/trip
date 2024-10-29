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
