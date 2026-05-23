"use client";

import { use, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/BreadCrumb";
import { getMonitoringList, getMonitoringDetail, getMonitoringPesertaDetail } from "@/services/MonitoringServices";
import { sendWebRtcSignal, getWebRtcOffer } from "@/services/ProctoringService";
import { toSlug } from "@/utils/slug";
import MonitoringPesertaSkeleton from "@/components/skeleton/MonitoringPesertaSkeleton";
import { getEcho } from "@/lib/echo";

const VIOLATION_LABEL: Record<string, string> = {
  tab:            "Tab",
  fullscreen:     "Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "No Face",
  multiple_faces: "Multi Face",
  looking_away:   "Tengok",
};

const VIOLATION_LABEL_FULL: Record<string, string> = {
  tab:            "Pindah Tab",
  fullscreen:     "Keluar Fullscreen",
  copypaste:      "Copy Paste",
  no_face:        "Wajah Tidak Terdeteksi",
  multiple_faces: "Banyak Wajah",
  looking_away:   "Menengok",
};

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  sedang_berlangsung: { label: "Berlangsung", bg: "var(--color-warning-light)", color: "var(--color-warning)" },
  selesai:            { label: "Selesai",     bg: "var(--color-primary-light)", color: "var(--color-primary)" },
  belum_mulai:        { label: "Belum Mulai", bg: "var(--akademik-tahun-bg)",   color: "var(--akademik-tahun-icon)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function MonitoringPesertaPage({ params }: { params: Promise<{ ujianId: string; userId: string }> }) {
  const { ujianId: ujianSlug, userId: pesertaSlug } = use(params);
  const router = useRouter();

  const { data: listData } = useSWR("/ujian/dosen/monitoring", getMonitoringList);
  const ujianMeta = listData?.data?.find(u => toSlug(u.nama_ujian) === ujianSlug);
  const ujianId   = ujianMeta?.id ?? null;

  const { data: detailData } = useSWR(
    ujianId ? `/ujian/dosen/monitoring/${ujianId}` : null,
    () => getMonitoringDetail(ujianId!),
  );
  const pesertaMeta = detailData?.peserta?.find(p => toSlug(p.nama ?? "") === pesertaSlug);
  const userId      = pesertaMeta?.user_id ?? null;

  const { data, mutate } = useSWR(
    ujianId && userId ? `/ujian/dosen/monitoring/${ujianId}/peserta/${userId}` : null,
    () => getMonitoringPesertaDetail(ujianId!, userId!),
    { revalidateOnFocus: true },
  );

  // Live view state — auto-set from active attempt
  const [liveId, setLiveId]               = useState<number | null>(null);
  const [hasStream, setHasStream]         = useState(false);
  const [hasScreenStream, setHasScreenStream] = useState(false);
  const liveVideoRef                      = useRef<HTMLVideoElement>(null);
  const screenVideoRef                    = useRef<HTMLVideoElement>(null);
  const pcRef                             = useRef<RTCPeerConnection | null>(null);
  const screenPcRef                       = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const active = data?.attempts?.find(a => a.status === "sedang_berlangsung");
    setLiveId(active?.peserta_ujian_id ?? null);
  }, [data]);

  useEffect(() => {
    if (!ujianId) return;
    const echo = getEcho();
    if (!echo) return;
    const channel = echo.channel(`ujian.${ujianId}`);
    channel.listen(".pelanggaran-masuk", (e: { user_id?: number }) => {
      if (!e.user_id || e.user_id === userId) mutate();
    });
    channel.listen(".jawaban-masuk", (e: { user_id?: number }) => {
      if (!e.user_id || e.user_id === userId) mutate();
    });
    return () => { echo.leaveChannel(`ujian.${ujianId}`); };
  }, [ujianId, userId, mutate]);

  // WebRTC receiver — auto-connect saat liveId tersedia
  useEffect(() => {
    if (!liveId) return;
    const echo = getEcho();
    if (!echo) return;

    const camOkRef    = { current: false };
    const screenOkRef = { current: false };

    const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];
    const decodeSdp   = (s: string) => { try { return atob(s); } catch { return s; } };
    const waitIce     = (pc: RTCPeerConnection) => new Promise<void>(resolve => {
      if (pc.iceGatheringState === "complete") { resolve(); return; }
      const t = setTimeout(resolve, 500);
      pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(t); resolve(); } };
    });

    // Buat answer dari offer SDP (baik dari backend cache maupun Pusher)
    const answerCam = async (offerSdp: string) => {
      if (camOkRef.current) return;
      pcRef.current?.close();
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      pc.ontrack = (e) => {
        if (liveVideoRef.current && e.streams[0]) {
          liveVideoRef.current.srcObject = e.streams[0];
          setHasStream(true);
          camOkRef.current = true;
        }
      };
      await pc.setRemoteDescription({ type: "offer", sdp: decodeSdp(offerSdp) });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitIce(pc);
      sendWebRtcSignal({ peserta_ujian_id: liveId, type: "answer", from: "dosen", sdp: btoa(pc.localDescription!.sdp) }).catch(() => {});
    };

    const answerScreen = async (offerSdp: string) => {
      if (screenOkRef.current) return;
      screenPcRef.current?.close();
      const spc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      screenPcRef.current = spc;
      spc.ontrack = (e) => {
        if (screenVideoRef.current && e.streams[0]) {
          screenVideoRef.current.srcObject = e.streams[0];
          setHasScreenStream(true);
          screenOkRef.current = true;
        }
      };
      await spc.setRemoteDescription({ type: "offer", sdp: decodeSdp(offerSdp) });
      const answer = await spc.createAnswer();
      await spc.setLocalDescription(answer);
      await waitIce(spc);
      sendWebRtcSignal({ peserta_ujian_id: liveId, type: "screen-answer", from: "dosen", sdp: btoa(spc.localDescription!.sdp) }).catch(() => {});
    };

    // Pusher listener — fallback kalau cache tidak ada / expired
    const ch = echo.channel(`proctoring-signal.${liveId}`);
    ch.listen(".webrtc-signal", async (msg: { type: string; from: string; sdp?: string }) => {
      if (msg.from !== "student") return;
      if (msg.type === "offer"        && msg.sdp) answerCam(msg.sdp);
      if (msg.type === "screen-offer" && msg.sdp) answerScreen(msg.sdp);
    });

    // Fast path: fetch pre-warmed offer dari backend (student sudah buat saat kamera ready)
    const tryCache = async () => {
      const [camSdp, screenSdp] = await Promise.all([
        getWebRtcOffer(liveId, "cam").catch(() => null),
        getWebRtcOffer(liveId, "screen").catch(() => null),
      ]);
      if (camSdp)    answerCam(camSdp);
      if (screenSdp) answerScreen(screenSdp);
    };
    tryCache();

    // Slow path fallback: kirim watch-request via Pusher (jika cache kosong / gagal)
    const sendRequests = () => {
      if (!camOkRef.current)    sendWebRtcSignal({ peserta_ujian_id: liveId, type: "watch-request",        from: "dosen" }).catch(() => {});
      if (!screenOkRef.current) sendWebRtcSignal({ peserta_ujian_id: liveId, type: "watch-screen-request", from: "dosen" }).catch(() => {});
    };
    // Delay 3 detik supaya fast path sempat selesai dulu sebelum fallback masuk
    const initialId = setTimeout(sendRequests, 3000);
    const retryId   = setInterval(() => {
      if (camOkRef.current && screenOkRef.current) return;
      sendRequests();
    }, 5000);

    return () => {
      clearTimeout(initialId);
      clearInterval(retryId);
      echo.leaveChannel(`proctoring-signal.${liveId}`);
      pcRef.current?.close();       pcRef.current = null;
      screenPcRef.current?.close(); screenPcRef.current = null;
      if (liveVideoRef.current)   liveVideoRef.current.srcObject = null;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      setHasStream(false);
      setHasScreenStream(false);
    };
  }, [liveId]);

  const peserta   = data?.peserta;
  const attempts  = data?.attempts ?? [];
  const summary   = data?.violation_summary ?? {};
  const totalSoal = data?.ujian.total_soal ?? 0;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Breadcrumb
        overrides={{
          [ujianSlug]:   ujianMeta?.nama_ujian ?? data?.ujian.nama_ujian ?? ujianSlug,
          [pesertaSlug]: peserta?.nama ?? pesertaSlug,
        }}
      />

      {!data && <MonitoringPesertaSkeleton />}

      {/* Live Camera Card */}
      {liveId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            {/* <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> */}
            <span className="text-sm font-semibold text-gray-700">Live Camera</span>
          </div>
          <div className="relative bg-gray-900 rounded-b-2xl overflow-hidden" style={{ minHeight: 320 }}>
            {/* Screen share — full area */}
            {!hasScreenStream && (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <span className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
                <span className="text-xs text-gray-500">Menunggu layar...</span>
              </div>
            )}
            <video ref={screenVideoRef} autoPlay playsInline
              className="w-full object-contain rounded-b-2xl"
              style={{ display: hasScreenStream ? "block" : "none", maxHeight: 480 }} />

            {/* Webcam — PiP overlay pojok kanan bawah */}
            <div className="absolute bottom-3 right-3 rounded-xl overflow-hidden border-2 shadow-lg"
              style={{ width: 180, borderColor: "var(--color-primary)", display: hasStream ? "block" : "none" }}>
              <video ref={liveVideoRef} autoPlay playsInline
                className="w-full object-cover scale-x-[-1]"
                style={{ height: 120 }} />
            </div>
          </div>
        </div>
      )}

      {data && <>
      {/* Card 1: Riwayat Attempt */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate" style={{ color: "var(--color-primary)" }}>
              {peserta?.nama ?? "Loading..."}
            </h1>
            <p className="text-xs text-gray-400">{peserta?.nim ?? ""}</p>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Riwayat Attempt</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium w-12">#</th>
                <th className="text-center px-4 py-3 font-medium w-24">Status</th>
                <th className="text-left px-4 py-3 font-medium w-36">Waktu</th>
                <th className="text-center px-4 py-3 font-medium w-20">Progress</th>
                {Object.keys(summary).map(type => (
                  <th key={type} className="text-center px-3 py-3 font-medium w-20">
                    {VIOLATION_LABEL[type] ?? type}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-medium w-20">Total</th>
                <th className="text-center px-4 py-3 font-medium w-24">Risk Score</th>
                <th className="text-center px-4 py-3 font-medium w-24">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attempts.length === 0 ? (
                <tr><td colSpan={4 + Object.keys(summary).length + 4} className="text-center py-8 text-sm text-gray-400">Belum ada data</td></tr>
              ) : attempts.map(a => (
                <tr key={a.attempt_ke} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-400">{String(a.attempt_ke).padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays size={11} className="text-gray-400 shrink-0" />
                      <span>{a.mulai_at ?? "-"}</span>
                    </div>
                    {a.selesai_at && (
                      <div className="text-xs text-gray-400 mt-0.5 pl-3.5">s/d {a.selesai_at}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-600">{a.soal_dijawab}/{totalSoal}</td>
                  {Object.keys(summary).map(type => {
                    const count = a.violation_breakdown?.[type] ?? 0;
                    return (
                      <td key={type} className="px-3 py-3 text-center">
                        {count > 0 ? (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                        ) : (
                          <span className="text-xs text-gray-300">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {a.violations > 0 ? (
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{a.violations}x</span>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-gray-600">{a.risk_score}</td>
                  <td className="px-4 py-3 text-center">
                    {a.foto_bukti?.length > 0 ? (
                      <Link
                        href={`/dosen/monitoring/${ujianSlug}/${pesertaSlug}/${a.attempt_ke}`}
                        className="text-xs font-medium hover:underline"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Lihat&nbsp;({a.foto_bukti.length})
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Total Pelanggaran per Jenis */}
      {Object.keys(summary).length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Total Pelanggaran per Jenis</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">Jenis Pelanggaran</th>
                <th className="text-center px-5 py-3 font-medium w-32">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Object.entries(summary).map(([type, count]) => (
                <tr key={type} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-700">{VIOLATION_LABEL_FULL[type] ?? type}</td>
                  <td className="px-5 py-3 text-center w-32">
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{count}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Card 3: Jawaban per Attempt */}
      {attempts.map(a => a.jawaban?.length > 0 && (
        <div key={a.attempt_ke} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Jawaban Attempt {String(a.attempt_ke).padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-400">{a.jawaban.length} soal dijawab</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-center px-4 py-3 font-medium w-16">No.</th>
                  <th className="text-left px-4 py-3 font-medium">Jawaban</th>
                  <th className="text-center px-4 py-3 font-medium w-24">Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {a.jawaban.map((j, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-center text-xs text-gray-400">{j.nomor}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-700 max-w-xs truncate">{j.jawaban ?? "-"}</td>
                    <td className="px-4 py-2.5 text-center">
                      {j.nilai != null ? (
                        <span className="text-xs font-semibold" style={{ color: (j.nilai ?? 0) >= 50 ? "var(--color-primary)" : "var(--color-danger)" }}>
                          {j.nilai}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      </>}

    </div>
  );
}
