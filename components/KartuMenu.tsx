import Link from "next/link";
import { type Menu, rupiah } from "@/data/menu";
import TombolFavorit from "@/components/TombolFavorit";

export default function KartuMenu({ menu }: { menu: Menu }) {
  const habis = menu.stok === 0;

  return (
    <div className={`flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
      habis ? "bg-slate-100 opacity-75 border-slate-300" : "bg-white border-slate-200"
    }`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {menu.kategori}
          </span>
          <div className="flex items-center gap-2">
            {habis ? (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                Habis
              </span>
            ) : (
              <span className="text-xs text-slate-500">Stok: {menu.stok}</span>
            )}
          </div>
        </div>

        <h2 className="mt-3 text-xl font-bold text-slate-900">{menu.nama}</h2>
        <p className="mt-2 text-lg font-semibold text-slate-800">{rupiah(menu.harga)}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        {/* Tombol Favorit versi kecil / compact untuk kartu */}
        <div className="scale-90 origin-left">
          <TombolFavorit id={menu.id} />
        </div>

        <Link
          href={`/menu/${menu.id}`}
          className={`flex-1 rounded-lg py-2 text-center text-sm font-medium text-white transition-colors ${
            habis ? "bg-slate-400 cursor-not-allowed pointer-events-none" : "bg-slate-900 hover:bg-blue-600"
          }`}
        >
          {habis ? "Habis" : "Lihat Detail"}
        </Link>
      </div>
    </div>
  );
}