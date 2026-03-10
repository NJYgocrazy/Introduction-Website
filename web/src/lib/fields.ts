import { getLocale } from "../i18n";

export function pickText(obj: any, base: string): string {
  const locale = getLocale();
  const key = `${base}${locale === "zh" ? "Zh" : "En"}`;
  const fallbackKey = `${base}Zh`;
  const v = obj?.[key] ?? obj?.[fallbackKey];
  return typeof v === "string" ? v : "";
}
