import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

let echo: Echo | null = null;

export function getEcho(): Echo | null {
  if (typeof window === "undefined") return null;
  if (echo) return echo;

  const key     = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
  if (!key) return null;

  window.Pusher = Pusher;
  echo = new Echo({
    broadcaster: "pusher",
    key,
    cluster,
    forceTLS: true,
  });

  return echo;
}
