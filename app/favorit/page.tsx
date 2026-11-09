"use client";
import { useState, useEffect } from "react";
import { type Menu } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";

export default function HalamanFavorit() {
  const [menuList, setMenuList] = useState<Menu[]>([]);
  const [favoritIds, setFavoritIds] = useState<number[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    // Ambil daftar ID favorit dari localStorage
    const favs = JSON.parse(localStorage.getItem("favorit") || "[]");
    setFavoritIds(favs);

    // Ambil data menu dari API Route yang sudah dibuat
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data menu dari server.");
        return res.json();
      })
      .then((data) => {
        setMenuList(data);
        setMemuat(false);
      })
      .catch((err) => {
        setGalat(err.message);
        setMemuat(false);
      });
  }, []);

  if (memuat) {
    return <p className="text-center py-16 text-slate-500 font-medium">Memuat...</p>;
  }

  if (galat) {
    return <p className="text-center py-16 text-red-600 font-semibold">{galat}</p>;
  }

  // Saring menu yang ID-nya ada di dalam daftar favorit
  const menuFavorit = menuList.filter((m) => favoritIds.includes(m.id));

  if (menuFavorit.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-slate-900">Menu Favorit</h1>
        <p className="mt-4 text-slate-500">Belum ada menu favorit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Menu Favorit</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuFavorit.map((m) => (
          <KartuMenu key={m.id} menu={m} />
        ))}
      </div>
    </div>
  );
}