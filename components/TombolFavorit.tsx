"use client";
import { useState, useEffect } from "react";

export default function TombolFavorit({ id } : { id: number }) {
    const [Favorit, setFavorit] = useState(false);

    useEffect(() => {
        const simpan: number[] = JSON.parse(localStorage.getItem("favorit") ?? "[]");
        setFavorit(simpan.includes(id));
    }, [id]);

    function ubah() {
        const simpan: number[] = JSON.parse(localStorage.getItem("favorit") ?? "[]");
        const baru = simpan.includes(id) ? simpan.filter((x) => x !== id) : [...simpan, id];
        localStorage.setItem("favorit", JSON.stringify(baru));
        setFavorit(!Favorit)
    }

    return (
        <button onClick={ubah} className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
        Favorit
          ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span>{Favorit ? "♥ Favorit" : "♡ Tambah favorit"}</span>
      </button>
    )
}