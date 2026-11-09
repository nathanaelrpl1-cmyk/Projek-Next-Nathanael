"use client";
import { useState } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

type Pesanan = {
  tanggal: string;
  nama: string;
  caraAmbil: string;
  kelas: string;
  item: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

export default function HalamanRiwayat() {
  // Inisialisasi state langsung dari localStorage
  const [riwayat] = useState<Pesanan[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("riwayat") || "[]");
  });

  const totalBelanjaSemua = riwayat.reduce((acc, curr) => acc + curr.total, 0);

  if (riwayat.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-slate-900">Riwayat Pesanan</h1>
        <p className="mt-4 text-slate-500">Belum ada pesanan.</p>
        <Link href="/menu" className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white">
          Pesan Menu Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Riwayat Pesanan</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex justify-between items-center text-sm font-medium text-slate-700">
        <span>Total Pesanan: <strong>{riwayat.length} pesanan</strong></span>
        <span>Total Belanja: <strong className="text-blue-600">{rupiah(totalBelanjaSemua)}</strong></span>
      </div>

      <div className="space-y-4">
        {riwayat.map((pesanan, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-500 border-b pb-2">
              <span>{pesanan.tanggal}</span>
              <span className="font-semibold text-slate-700">Pemesan: {pesanan.nama}</span>
            </div>

            <ul className="space-y-1 text-sm text-slate-700">
              {pesanan.item.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{i.nama} (x{i.jumlah})</span>
                  <span>{rupiah(i.subtotal)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-2 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between"><span>Pengiriman:</span><span>{pesanan.caraAmbil === "diantar" ? `Diantar ke ${pesanan.kelas} (+Rp 2.000)` : "Ambil sendiri"}</span></div>
              {pesanan.diskon > 0 && <div className="flex justify-between text-green-600"><span>Diskon:</span><span>-{rupiah(pesanan.diskon)}</span></div>}
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t">
                <span>Total Bayar:</span>
                <span className="text-blue-600">{rupiah(pesanan.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}