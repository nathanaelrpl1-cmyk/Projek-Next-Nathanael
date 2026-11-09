"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

const menu = [
    { href: "/", teks: "Beranda"},
    { href: "/menu", teks: "Menu" },
    { href: "/favorit", teks: "Favorit"},
    { href: "/keranjang", teks: "Keranjang"},
    { href: "/riwayat", teks: "Riwayat"},
];

function NavContent() {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const data = JSON.parse(localStorage.getItem("keranjang") || "[]");
      return data.reduce((acc: number, item: { jumlah: number }) => acc + item.jumlah, 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const hitungTotalItem = () => {
      try {
        const data = JSON.parse(localStorage.getItem("keranjang") || "[]");
        const total = data.reduce((acc: number, item: { jumlah: number }) => acc + item.jumlah, 0);
        setJumlahKeranjang(total);
      } catch {
        setJumlahKeranjang(0);
      }
    };

    window.addEventListener("keranjang-berubah", hitungTotalItem);
    return () => {
      window.removeEventListener("keranjang-berubah", hitungTotalItem);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between shadow-sm bg-slate-50 px-8 py-4 rounded-b-[2rem] border-b border-slate-200">
      <span className="text-xl font-bold text-black">Kantinku</span>
      <div className="flex items-center gap-6">
        {menu.map((m) => {
          const aktif = pathname === m.href;
          const adalahKeranjang = m.href === "/keranjang";

          return (
            <Link
              key={m.href}
              href={m.href}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                aktif
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-600 hover:text-black hover:bg-slate-200/60"
              }`}
            >
              {m.teks}
              {adalahKeranjang && jumlahKeranjang > 0 && (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  aktif ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
                    {jumlahKeranjang}
                  </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<nav className="px-8 py-4 bg-slate-50 border-b border-slate-200 rounded-b-[2rem]">Kantinku</nav>}>
      <NavContent />
    </Suspense>
  );
}