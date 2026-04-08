"use client";

import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import Cropper from "react-easy-crop";
import { User } from "../../services/AuthServices";
import { updateProfile } from "../../services/UserServices";
import { getCroppedImg, Area } from "../../utils/cropImage";
import Avatar from "../Avatar";

interface Props {
  user: User;
  onClose: () => void;
  onSaved: () => void;
}

export default function UbahProfilModal({ user, onClose, onSaved }: Props) {
  const [nama, setNama] = useState(user.nama || "");
  const [noTelp, setNoTelp] = useState(user.no_telp || "");
  const [alamat, setAlamat] = useState(user.alamat || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setRawImageSrc(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    const file = await getCroppedImg(rawImageSrc, croppedAreaPixels);
    setCroppedFile(file);
    setCroppedPreview(URL.createObjectURL(file));
    setRawImageSrc(null);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("no_telp", noTelp);
      formData.append("alamat", alamat);
      if (croppedFile) formData.append("foto", croppedFile);
      formData.append("_method", "PUT");
      await updateProfile(formData);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500";

  // Crop screen
  if (rawImageSrc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
            <h3 className="text-base font-bold text-white">Crop Foto</h3>
            <button onClick={() => setRawImageSrc(null)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full h-72 bg-white">
            <Cropper
              image={rawImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="px-6 py-3">
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="flex gap-3 px-6 pb-6">
            <button
              type="button"
              onClick={() => setRawImageSrc(null)}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleCropConfirm}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "var(--color-primary)" }}>
          <h3 className="text-base font-bold text-white">Ubah Profil</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Lengkap</label>
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nomor Telepon</label>
            <input type="text" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Alamat</label>
            <input type="text" value={alamat} onChange={(e) => setAlamat(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Foto Profil</label>
            <div className="flex items-center gap-3">
              {croppedPreview ? (
                <img src={croppedPreview} alt="preview" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <Avatar user={user} size={48} />
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-white text-sm px-4 py-2 rounded-lg"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Telusuri Media
              </button>
              {croppedFile && <span className="text-xs text-gray-400 truncate max-w-[120px]">{croppedFile.name}</span>}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
