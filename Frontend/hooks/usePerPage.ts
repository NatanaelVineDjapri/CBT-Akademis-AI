import { useLayoutEffect, useState } from "react";

export function calcPerPage(cardHeight: number, cols: number, offset = 220): number {
  if (typeof window === "undefined") return cols * 2;
  const rows = Math.max(1, Math.floor((window.innerHeight - offset) / cardHeight));
  return rows * cols;
}

export function usePerPage(cardHeight: number, cols: number, offset = 220) {
  const [perPage, setPerPage] = useState(() => calcPerPage(cardHeight, cols, offset));

  useLayoutEffect(() => {
    const calc = () => setPerPage(calcPerPage(cardHeight, cols, offset));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [cardHeight, cols, offset]);

  return perPage;
}
