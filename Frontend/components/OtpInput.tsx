"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function OtpInput({ value, onChange }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    const next = (value.slice(0, i) + digit + value.slice(i + 1)).slice(0, 6);
    onChange(next);
    if (digit && i < 5) focus(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) focus(i - 1);
    else if (e.key === "ArrowLeft" && i > 0) focus(i - 1);
    else if (e.key === "ArrowRight" && i < 5) focus(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    focus(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={value[i] ?? ""}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={e => e.target.select()}
            autoFocus={i === 0}
            className="w-10 h-12 text-center text-base font-bold border-2 rounded-xl focus:outline-none transition-colors"
            style={{
              borderColor: value[i] ? "var(--color-primary)" : "#e5e7eb",
              color: "#111827",
            }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400">
        {value.length >= 6 ? "Kode lengkap" : `${6 - value.length} digit lagi`}
      </p>
    </div>
  );
}
