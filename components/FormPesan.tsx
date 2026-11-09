"use client";
import { useState } from "react";
import { type Menu, rupiah } from "@/data/menu";

export default function FormPesan({ menu }: { menu: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  const habis = menu.stok === 0;

  // Jika stok 0 (Langkah 10)
  if (habis) {
    return <p className="mt-6 text-sm font-semibold text-red-600">Menu ini habis.</p>;
  }

  const handleTambahKeranjang = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPesan("");

    // Validasi jumlah minimal 1 dan tidak melebihi stok (Langkah 9)
    if (jumlah < 1) {
      setError("Jumlah minimal adalah 1.");
      return;
    }

    // Ambil data keranjang yang sudah ada di localStorage
    const keranjangLama = JSON.parse(localStorage.getItem("keranjang") || "[]");

    // Cek apakah menu yang sama sudah ada di keranjang
    const indexAda = keranjangLama.findIndex((item: { id: number }) => item.id === menu.id);
    let totalJumlahDiKeranjang = jumlah;

    if (indexAda !== -1) {
      totalJumlahDiKeranjang += keranjangLama[indexAda].jumlah;
    }

    if (totalJumlahDiKeranjang > menu.stok) {
      setError(`Stok tidak cukup! Maksimal stok tersedia: ${menu.stok} (di keranjang sudah ada ${indexAda !== -1 ? keranjangLama[indexAda].jumlah : 0})`);
      return;
    }

    // Masukkan atau gabungkan ke keranjang
    if (indexAda !== -1) {
      keranjangLama[indexAda].jumlah = totalJumlahDiKeranjang;
    } else {
      keranjangLama.push({ id: menu.id, jumlah: jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjangLama));

    // Kirim kabar/event agar Navbar mendeteksi perubahan (Langkah 15)
    window.dispatchEvent(new Event("keranjang-berubah"));

    setPesan("Ditambahkan ke keranjang.");
  };

  return (
    <form onSubmit={handleTambahKeranjang} className="mt-6 space-y-4 border-t pt-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">Jumlah Pesanan:</label>
        <div className="mt-1 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={menu.stok}
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <span className="text-sm text-slate-500">
            Total Harga: <strong className="text-slate-900">{rupiah(menu.harga * jumlah)}</strong>
          </span>
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {pesan && <p className="text-sm font-semibold text-green-600">{pesan}</p>}

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Tambah ke keranjang
      </button>
    </form>
  );
}