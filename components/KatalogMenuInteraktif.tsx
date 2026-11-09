"use client";
import { useState, useEffect } from "react";
import { rupiah, type Menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";
import KontrolMenu from "./KontrolMenu";

export default function KatalogMenuInteraktif({ daftarMenu }: { daftarMenu: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  
  const [urut, setUrut] = useState(() => {
    if (typeof window === "undefined") return "awal";
    return localStorage.getItem("urutMenu") || "awal";
  });

  const [jumlahTampil, setJumlahTampil] = useState(4);
  const [hanyaAdaStok, setHanyaAdaStok] = useState(false);
  const [hargaMaksimal, setHargaMaksimal] = useState("");

  useEffect(() => {
    localStorage.setItem("urutMenu", urut);
  }, [urut]);

  const daftarKategori = ["Semua", ...new Set(daftarMenu.map((m) => m.kategori))];

  const hasil = daftarMenu.filter((m) => {
    const cocokCari = m.nama.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori = kategori === "Semua" || m.kategori === kategori;
    const cocokStok = !hanyaAdaStok || m.stok > 0;
    const cocokHarga = hargaMaksimal === "" || m.harga <= Number(hargaMaksimal);

    return cocokCari && cocokKategori && cocokStok && cocokHarga;
  });

  const rataRataHarga =
    hasil.length === 0
      ? "—"
      : rupiah(hasil.reduce((total, m) => total + m.harga, 0) / hasil.length);

  const totalSisaStok = hasil.reduce(
    (total, m) => total + m.stok,
    0,
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.nama.localeCompare(b.nama);
    return a.id - b.id; 
  });

  return (
    <div>
      <KontrolMenu
        cari={cari}
        setCari={setCari}
        kategori={kategori}
        setKategori={setKategori}
        daftarKategori={daftarKategori}
        urut={urut}
        setUrut={setUrut}
        hanyaAdaStok={hanyaAdaStok}
        setHanyaAdaStok={setHanyaAdaStok}
        hargaMaksimal={hargaMaksimal}
        setHargaMaksimal={setHargaMaksimal}
        setJumlahTampil={setJumlahTampil}
      />

      <p className="mb-3 mt-4 text-sm text-slate-500">
        {tersusun.length} menu ditemukan
      </p>
      <p className="mb-3 text-sm text-slate-500">
        Rata-rata harga: {rataRataHarga} · Total sisa stok: {totalSisaStok}
      </p>

      {tersusun.length === 0 ? (
        <p className="text-slate-500 py-6">Menu tidak ditemukan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.slice(0, jumlahTampil).map((m) => (
            <KartuMenu key={m.id} menu={m} />
          ))}
        </div>
      )}

      {tersusun.length > jumlahTampil && (
        <button
          type="button"
          onClick={() => setJumlahTampil((jumlah) => jumlah + 4)}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Tampilkan lagi
        </button>
      )}
    </div>
  );
}