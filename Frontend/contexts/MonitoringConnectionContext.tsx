"use client";

import { createContext, useContext, useRef, useCallback, ReactNode } from "react";
import { getWebRtcOffer, sendWebRtcSignal } from "@/services/ProctoringService";
import { ICE_SERVERS } from "@/lib/iceServers";

interface ConnEntry {
  camPc:       RTCPeerConnection | null;
  screenPc:    RTCPeerConnection | null;
  camStream:   MediaStream | null;
  screenStream: MediaStream | null;
  camSubs:     ((s: MediaStream) => void)[];
  screenSubs:  ((s: MediaStream) => void)[];
}

interface Ctx {
  preConnect:    (id: number) => void;
  onCam:         (id: number, cb: (s: MediaStream) => void) => () => void;
  onScreen:      (id: number, cb: (s: MediaStream) => void) => () => void;
  getCamStream:  (id: number) => MediaStream | null;
  getScreenStream: (id: number) => MediaStream | null;
}

const MonitoringConnectionContext = createContext<Ctx | null>(null);

export function MonitoringConnectionProvider({ children }: { children: ReactNode }) {
  const store = useRef(new Map<number, ConnEntry>());

  const fixSdp = (sdp: string) =>
    window.location.hostname !== "localhost" ? sdp :
    sdp.replace(/[\w-]+\.local/g, "127.0.0.1");
  const decodeSdp = (s: string) => { try { return atob(s); } catch { return s; } };
  const waitIce = (pc: RTCPeerConnection, ms: number) => new Promise<void>(resolve => {
    if (pc.iceGatheringState === "complete") { resolve(); return; }
    const t = setTimeout(resolve, ms);
    pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(); } };
  });

  const getOrCreate = (id: number): ConnEntry => {
    if (!store.current.has(id)) {
      store.current.set(id, { camPc: null, screenPc: null, camStream: null, screenStream: null, camSubs: [], screenSubs: [] });
    }
    return store.current.get(id)!;
  };

  const preConnect = useCallback(async (id: number) => {
    const e = getOrCreate(id);

    if (!e.camPc) {
      const sdp = await getWebRtcOffer(id, "cam").catch(() => null);
      if (sdp && !e.camPc) {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        e.camPc = pc;
        pc.ontrack = (ev) => {
          const s = ev.streams?.[0] ?? new MediaStream([ev.track]);
          e.camStream = s;
          e.camSubs.forEach(cb => cb(s));
          e.camSubs = [];
        };
        pc.onconnectionstatechange = () => {
          if (pc.connectionState === "failed") { e.camPc = null; e.camStream = null; }
        };
        await pc.setRemoteDescription({ type: "offer", sdp: fixSdp(decodeSdp(sdp)) });
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        await waitIce(pc, 2000);
        sendWebRtcSignal({ peserta_ujian_id: id, type: "answer", from: "dosen", sdp: btoa(fixSdp(pc.localDescription!.sdp)) }).catch(() => {});
      }
    }

    if (!e.screenPc) {
      const sdp = await getWebRtcOffer(id, "screen").catch(() => null);
      if (sdp && !e.screenPc) {
        const spc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        e.screenPc = spc;
        spc.ontrack = (ev) => {
          const s = ev.streams?.[0] ?? new MediaStream([ev.track]);
          e.screenStream = s;
          e.screenSubs.forEach(cb => cb(s));
          e.screenSubs = [];
        };
        spc.onconnectionstatechange = () => {
          if (spc.connectionState === "failed") { e.screenPc = null; e.screenStream = null; }
        };
        await spc.setRemoteDescription({ type: "offer", sdp: fixSdp(decodeSdp(sdp)) });
        const ans = await spc.createAnswer();
        await spc.setLocalDescription(ans);
        await waitIce(spc, 2000);
        sendWebRtcSignal({ peserta_ujian_id: id, type: "screen-answer", from: "dosen", sdp: btoa(fixSdp(spc.localDescription!.sdp)) }).catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCam = useCallback((id: number, cb: (s: MediaStream) => void) => {
    const e = getOrCreate(id);
    if (e.camStream) { cb(e.camStream); return () => {}; }
    e.camSubs.push(cb);
    return () => { e.camSubs = e.camSubs.filter(x => x !== cb); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScreen = useCallback((id: number, cb: (s: MediaStream) => void) => {
    const e = getOrCreate(id);
    if (e.screenStream) { cb(e.screenStream); return () => {}; }
    e.screenSubs.push(cb);
    return () => { e.screenSubs = e.screenSubs.filter(x => x !== cb); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCamStream    = useCallback((id: number) => store.current.get(id)?.camStream    ?? null, []);
  const getScreenStream = useCallback((id: number) => store.current.get(id)?.screenStream ?? null, []);

  return (
    <MonitoringConnectionContext.Provider value={{ preConnect, onCam, onScreen, getCamStream, getScreenStream }}>
      {children}
    </MonitoringConnectionContext.Provider>
  );
}

export const useMonitoringConnection = () => {
  const ctx = useContext(MonitoringConnectionContext);
  if (!ctx) throw new Error("No MonitoringConnectionProvider");
  return ctx;
};
