
const TZ = "Asia/Jakarta";

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    timeZone: TZ,
  });
}

export function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "short",
    timeZone: TZ,
  });
}

export function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
    timeZone: TZ,
  });
}

/** Convert API date string → "YYYY-MM-DDTHH:mm" dalam timezone Jakarta (untuk datetime-local input) */
export function toJakartaInput(dt: string | null | undefined): string {
  if (!dt) return "";
  const d = new Date(dt.replace(" ", "T"));
  return d.toLocaleString("sv-SE", { timeZone: TZ }).slice(0, 16).replace(" ", "T");
}

export function formatDateTime(d: string) {
  if (!d) return "-";
  let str = d.replace(" ", "T");
  if (!str.endsWith("Z") && !str.match(/[+-]\d{2}:?\d{2}$/)) str += "Z";
  const date = new Date(str);
  if (isNaN(date.getTime())) return d;
  const datePart = date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });
  const timePart = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  return `${datePart}, ${timePart}`;
}
