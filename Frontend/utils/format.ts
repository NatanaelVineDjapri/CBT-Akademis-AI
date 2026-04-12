export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
