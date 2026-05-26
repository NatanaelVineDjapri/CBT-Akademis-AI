const username   = process.env.NEXT_PUBLIC_TURN_USERNAME  ?? "";
const credential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL ?? "";

export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.relay.metered.ca:80" },
  { urls: "turn:global.relay.metered.ca:80",                  username, credential },
  { urls: "turn:global.relay.metered.ca:80?transport=tcp",    username, credential },
  { urls: "turn:global.relay.metered.ca:443",                 username, credential },
  { urls: "turns:global.relay.metered.ca:443?transport=tcp",  username, credential },
];
