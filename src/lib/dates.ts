import "server-only";

export const TIMEZONE = process.env.APP_TIMEZONE || "UTC";

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE, ...opts });

export const formatEntryDate = (d: Date) =>
  fmt({ weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(d);

export const formatTime = (d: Date) =>
  fmt({ hour: "numeric", minute: "2-digit" }).format(d);

/** YYYY-MM-DD of a moment, in the diary's timezone */
export const toLocalISODate = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d);

export const todayISO = () => toLocalISODate(new Date());

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** inclusive number of days */
export const daysBetween = (startISO: string, endISO: string) =>
  Math.round((Date.parse(`${endISO}T00:00:00Z`) - Date.parse(`${startISO}T00:00:00Z`)) / 86_400_000) + 1;

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${iso}T00:00:00Z`));

export const formatRange = (start: string, end: string) => `${formatDay(start)} – ${formatDay(end)}`;
export const reportTitle = (start: string, end: string) => `Session notes: ${formatRange(start, end)}`;