import i18n from "../i18n";

function getLocale() {
  return i18n.language === "en" ? "en-US" : "uk-UA";
}

export function datePeriodFormatter(dateFrom, dateTo) {
  let result = "";
  if (dateFrom && dateTo) {
    const locale = getLocale();
    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);
    result = `${dateFromObj.getDate()} ${dateFromObj.toLocaleString(locale, { month: "short" })} - ${dateToObj.getDate()} ${dateToObj.toLocaleString(locale, { month: "short" })} ${dateToObj.getFullYear()}`;
  }
  return result;
}

export function dateFormatter(date, format = "short") {
  const locale = getLocale();
  const dateObj = new Date(date);
  if (format === "short")
    return `${dateObj.getDate()} ${dateObj.toLocaleString(locale, { month: "short" })}`;
  if (format === "long")
    return `${dateObj.getDate()} ${dateObj.toLocaleString(locale, { month: "long" })} ${dateObj.getFullYear()}`;
}
