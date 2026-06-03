import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<"pusher">;
  }
}

let echo: Echo<"pusher"> | null = null;

export function getEcho(): Echo<"pusher"> | null {
  if (typeof window === "undefined") return null;
  if (echo) return echo;

  const key     = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
  if (!key) return null;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8000";
  const csrfToken  = () => decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? "");

  window.Pusher = Pusher;
  echo = new Echo({
    broadcaster:  "pusher",
    key,
    cluster,
    forceTLS:     true,
    authEndpoint: `${backendUrl}/broadcasting/auth`,
    auth: {
      headers: {
        "X-XSRF-TOKEN": csrfToken(),
      },
    },
  });

  return echo;
}
