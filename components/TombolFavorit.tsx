"use client";
import { useState } from "react";

export default function TombolFavorit({ id }: { id: number }) {
  const [isFavorit, setIsFavorit] = useState(() => {
    if (typeof window === "undefined") return false;
    const simpan: number[] = JSON.parse(localStorage.getItem("favorit") ?? "[]");
    return simpan.includes(id);
  });

  const toggleFavorit = () => {
    const favoritList = JSON.parse(localStorage.getItem("favorit") || "[]");
    let daftarBaru;

    if (isFavorit) {
      daftarBaru = favoritList.filter((favId: number) => favId !== id);
    } else {
      daftarBaru = [...favoritList, id];
    }

    localStorage.setItem("favorit", JSON.stringify(daftarBaru));
    setIsFavorit(!isFavorit);
  };

  return (
    <button
      onClick={toggleFavorit}
      type="button"
      className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
        isFavorit
          ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>{isFavorit ? "♥ Favorit" : "♡ Tambah favorit"}</span>
    </button>
  );
}