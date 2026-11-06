"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const menu = [
    { href: "/", teks: "Beranda"},
    { href: "/menu", teks: "Menu" },
    { href: "/favorit", teks: "Favorit"},
    { href: "/keranjang", teks: "Keranjang"},
    { href: "/riwayat", teks: "Riwayat"},
];

function NavContent() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between shadow-sm bg-slate-50 px-8 py-4 rounded-b-[2rem] border-b border-slate-200">
      <span className="text-xl font-bold text-black">Kantinku</span>
      <div className="flex items-center gap-6">
        {menu.map((m) => {
          const aktif = pathname === m.href;
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