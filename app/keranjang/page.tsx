"use client";
import { useState, useEffect } from "react";
import { menu, rupiah, type Menu } from "@/data/menu";
import Link from "next/link";

type ItemKeranjang = {
  id: number;
  jumlah: number;
};

export default function HalamanKeranjang() {
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
  const [kodePromo, setKodePromo] = useState("");
  const [diskonAktif, setDiskonAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");
  
  const [caraAmbil, setCaraAmbil] = useState("sendiri"); // 'sendiri' atau 'diantar'
  const [namaPemesan, setNamaPemesan] = useState("");
  const [kelas, setKelas] = useState("");
  const [struk, setStruk] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState("");

  // Ambil data keranjang dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("keranjang") || "[]");
    setKeranjang(data);
  }, []);

  // Fungsi helper untuk menyimpan dan memicu event navbar
  const simpanKeStorage = (dataBaru: ItemKeranjang[]) => {
    setKeranjang(dataBaru);
    localStorage.setItem("keranjang", JSON.stringify(dataBaru));
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  // Ubah jumlah item (+ atau -)
  const ubahJumlah = (id: number, delta: number) => {
    const itemMenu = menu.find((m) => m.id === id);
    if (!itemMenu) return;

    const dataBaru = keranjang.map((item) => {
      if (item.id === id) {
        const jumlahBaru = item.jumlah + delta;
        // Validasi: tidak boleh kurang dari 1 atau melebihi stok
        if (jumlahBaru < 1) return item;
        if (jumlahBaru > itemMenu.stok) return item;
        return { ...item, jumlah: jumlahBaru };
      }
      return item;
    });

    simpanKeStorage(dataBaru);
  };

  // Hapus baris item
  const hapusItem = (id: number) => {
    const dataBaru = keranjang.filter((item) => item.id !== id);
    simpanKeStorage(dataBaru);
  };

  // Hitung Subtotal
  const subtotal = keranjang.reduce((total, item) => {
    const itemMenu = menu.find((m) => m.id === item.id);
    return total + (itemMenu ? itemMenu.harga * item.jumlah : 0);
  }, 0);

  // Validasi otomatis diskon jika subtotal turun di bawah Rp 20.000 (Langkah 12)
  useEffect(() => {
    if (subtotal < 20000 && diskonAktif) {
      setDiskonAktif(false);
      setPesanPromo("Subtotal di bawah Rp 20.000, diskon otomatis tidak berlaku lagi.");
    }
  }, [subtotal, diskonAktif]);

  // Tombol Pakai Promo (Langkah 12)
  const handlePakaiPromo = () => {
    setPesanPromo("");
    const kodeClean = kodePromo.trim().toUpperCase();

    if (kodeClean === "") {
      setDiskonAktif(false);
      return;
    }

    if (kodeClean !== "HEMAT10") {
      setDiskonAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setDiskonAktif(false);
      setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      return;
    }

    setDiskonAktif(true);
    setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
  };

  // Hitung Nilai Diskon (Dibulatkan dengan Math.round)
  const nilaiDiskon = diskonAktif ? Math.round(subtotal * 0.1) : 0;
  const ongkir = caraAmbil === "diantar" ? 2000 : 0;
  const totalBayar = subtotal - nilaiDiskon + ongkir;

  // Tombol Pesan Sekarang (Langkah 14)
  const handlePesanSekarang = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm("");

    if (namaPemesan.trim().length < 3) {
      setErrorForm("Nama pemesan wajib diisi minimal 3 huruf.");
      return;
    }

    if (caraAmbil === "diantar" && kelas.trim().length < 3) {
      setErrorForm("Kelas wajib diisi minimal 3 karakter jika makanan diantar.");
      return;
    }

    // Susun Rincian Pesanan untuk Struk & Riwayat
    const rincianItem = keranjang.map((item) => {
      const m = menu.find((x) => x.id === item.id);
      return `${m?.nama} x${item.jumlah} = ${rupiah((m?.harga || 0) * item.jumlah)}`;
    });

    const teksPengiriman = caraAmbil === "diantar" ? `Diantar ke ${kelas}: Rp 2.000` : "Diambil sendiri di kantin";
    
    // Simpan ke Riwayat di localStorage
    const riwayatLama = JSON.parse(localStorage.getItem("riwayat") || "[]");
    const pesananBaru = {
      tanggal: new Date().toLocaleString("id-ID"),
      nama: namaPemesan,
      caraAmbil,
      kelas: caraAmbil === "diantar" ? kelas : "-",
      item: keranjang.map(item => {
        const m = menu.find(x => x.id === item.id);
        return { nama: m?.nama, jumlah: item.jumlah, subtotal: (m?.harga || 0) * item.jumlah };
      }),
      subtotal,
      diskon: nilaiDiskon,
      ongkir,
      total: totalBayar
    };
    localStorage.setItem("riwayat", JSON.stringify([pesananBaru, ...riwayatLama]));

    // Buat Struk Tampilan
    const strukText = `Terima kasih, ${namaPemesan}!\n` +
      rincianItem.join("\n") +
      `\nSubtotal: ${rupiah(subtotal)}` +
      (diskonAktif ? `\nDiskon (10%): -${rupiah(nilaiDiskon)}` : "") +
      `\nPengiriman: ${teksPengiriman}` +
      `\nTotal bayar: ${rupiah(totalBayar)}`;

    setStruk(strukText);

    // Kosongkan keranjang & reset form (Langkah 14)
    localStorage.removeItem("keranjang");
    setKeranjang([]);
    setKodePromo("");
    setDiskonAktif(false);
    setNamaPemesan("");
    setKelas("");
    window.dispatchEvent(new Event("keranjang-berubah"));
  };

  if (struk) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-6 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-green-600">Pesanan Berhasil!</h2>
        <pre className="mt-4 whitespace-pre-wrap rounded bg-slate-50 p-4 text-left text-sm text-slate-700 font-sans border">
          {struk}
        </pre>
        <button
          onClick={() => setStruk(null)}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Belanja Lagi
        </button>
      </div>
    );
  }

  if (keranjang.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-slate-800">Keranjang Belanja</h2>
        <p className="mt-2 text-slate-500">Keranjang masih kosong.</p>
        <Link href="/menu" className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white">
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Keranjang Belanja</h1>

      {/* Tabel Item Keranjang */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Menu</th>
              <th className="p-4">Jumlah</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {keranjang.map((item) => {
              const itemMenu = menu.find((m) => m.id === item.id);
              if (!itemMenu) return null;
              return (
                <tr key={item.id}>
                  <td className="p-4 font-medium text-slate-900">{itemMenu.nama}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => ubahJumlah(item.id, -1)} className="rounded border px-2 py-0.5 hover:bg-slate-100">-</button>
                      <span>{item.jumlah}</span>
                      <button onClick={() => ubahJumlah(item.id, 1)} className="rounded border px-2 py-0.5 hover:bg-slate-100">+</button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{rupiah(itemMenu.harga * item.jumlah)}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => hapusItem(item.id)} className="text-red-600 hover:underline text-xs font-semibold">Hapus</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bagian Promo (Langkah 12) */}
      <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
        <h3 className="font-semibold text-slate-800">Punya Kode Promo?</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Contoh: HEMAT10"
            value={kodePromo}
            onChange={(e) => setKodePromo(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm uppercase flex-1 focus:outline-none focus:border-blue-500"
          />
          <button onClick={handlePakaiPromo} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Pakai
          </button>
        </div>
        {pesanPromo && <p className="text-xs font-medium text-blue-600">{pesanPromo}</p>}
      </div>

      {/* Ringkasan & Form Pemesanan (Langkah 13 & 14) */}
      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Rincian Pembayaran</h3>
        <div className="space-y-1.5 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></div>
          {diskonAktif && <div className="flex justify-between text-green-600"><span>Diskon (10%)</span><span>-{rupiah(nilaiDiskon)}</span></div>}
          <div className="flex justify-between"><span>Ongkir</span><span>{rupiah(ongkir)}</span></div>
          <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2"><span>Total</span><span>{rupiah(totalBayar)}</span></div>
        </div>

        <form onSubmit={handlePesanSekarang} className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Cara Ambil:</label>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="caraAmbil" checked={caraAmbil === "sendiri"} onChange={() => setCaraAmbil("sendiri")} />
                Ambil sendiri
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="caraAmbil" checked={caraAmbil === "diantar"} onChange={() => setCaraAmbil("diantar")} />
                Diantar (+Rp 2.000)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Nama Pemesan (min. 3 huruf):</label>
            <input
              type="text"
              value={namaPemesan}
              onChange={(e) => setNamaPemesan(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Masukkan nama Anda"
            />
          </div>

          {caraAmbil === "diantar" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Kelas (min. 3 karakter):</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Contoh: XII RPL"
              />
            </div>
          )}

          {errorForm && <p className="text-sm font-semibold text-red-600">{errorForm}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Pesan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}