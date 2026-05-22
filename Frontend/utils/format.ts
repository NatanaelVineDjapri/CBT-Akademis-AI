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
  return new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
    timeZone: TZ,
  });
}

/** Convert API date string → "YYYY-MM-DDTHH:mm" dalam timezone Jakarta (untuk datetime-local input) */
export function toJakartaInput(dt: string | null | undefined): string {
  if (!dt) return "";
  const d = new Date(dt.replace(" ", "T"));
  // sv-SE locale → "YYYY-MM-DD HH:mm:ss"
  return d.toLocaleString("sv-SE", { timeZone: TZ }).slice(0, 16).replace(" ", "T");
}
