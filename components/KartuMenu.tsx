import Link from "next/link";
import { type Menu, rupiah } from "@/data/menu";

export default function KartuMenu({ menu }: { menu: Menu }) {
  const habis = menu.stok === 0;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {menu.kategori}
          </span>
          {habis ? (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
              Habis
            </span>
          ) : (
            <span className="text-xs text-slate-500">Stok: {menu.stok}</span>
          )}
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-900">{menu.nama}</h2>
        <p className="mt-2 text-lg font-semibold text-slate-800">{rupiah(menu.harga)}</p>
      </div>

      <div className="mt-5">
        <Link
          href={`/menu/${menu.id}`}
          className="block w-full rounded-lg bg-slate-900 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}