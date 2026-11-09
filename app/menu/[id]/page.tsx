import { notFound } from "next/navigation";
import Link from "next/link";
import { menu, rupiah } from "@/data/menu";
import FormPesan from "@/components/FormPesan";
import { Suspense } from "react";
import TombolFavorit from "@/components/TombolFavorit";

type PageProps = {
    params: Promise<{ id: string }>;
};

// 1. Pindahkan logika utama ke komponen terpisah yang bersifat async
async function DetailMenuContent({ params }: PageProps) {
    const { id } = await params;
    const item = menu.find((m) => m.id === Number(id));
    if (!item) notFound();

    const habis = item.stok === 0;

    // Filter menu lain dengan kategori yang sama dan bukan menu yang sedang dibuka
    const menuTerkait = menu.filter(
        (m) => m.kategori === item.kategori && m.id !== item.id
    );

    return (
        <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {item.kategori}
                </span>
                {habis ? (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                        Habis
                    </span>
                ) : (
                    <span className="text-sm text-slate-500">Stok tersisa: {item.stok}</span>
                )}
            </div>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">{item.nama}</h1>
            <p className="mt-4 text-2xl font-semibold text-blue-600">{rupiah(item.harga)}</p>

            {/* Komponen Formulir Pesan Keranjang */}
            <FormPesan menu={item} />
            <TombolFavorit id={item.id}/>

            <div className="mt-6">
                <Link
                    href="/menu"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    &larr; Kembali ke Daftar Menu
                </Link>
            </div>

            {/* Bagian Menu Terkait di bawah */}
            <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Menu terkait</h3>
                {menuTerkait.length === 0 ? (
                    <p className="text-sm text-slate-500">Belum ada menu terkait dalam kategori ini.</p>
                ) : (
                    <ul className="space-y-2">
                        {menuTerkait.map((terkait) => (
                            <li key={terkait.id}>
                                <Link
                                    href={`/menu/${terkait.id}`}
                                    className="text-blue-600 hover:underline font-medium text-sm"
                                >
                                    {terkait.nama} — <span className="text-slate-600">{rupiah(terkait.harga)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </article>
    );
}

export default function DetailMenu({ params }: PageProps) {
    return (
        <Suspense fallback={<p className="text-center py-10 text-slate-500">Memuat detail menu...</p>}>
            <DetailMenuContent params={params} />
        </Suspense>
    );
}