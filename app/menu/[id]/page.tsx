import { notFound } from "next/navigation";
import Link from "next/link";
import { menu, rupiah } from "@/data/menu";
import { Suspense } from "react";

type PageProps = {
    params: Promise<{ id: string }>;
};

async function DetailContent({ params }: PageProps) {
    const { id } = await params;
    const item = menu.find((m) => m.id === Number(id));
    if (!item) notFound();

    const habis = item.stok === 0;

    return (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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

            <div className="mt-6 flex gap-4">
                <Link
                    href="/menu"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    Kembali ke Menu
                </Link>
            </div>
        </article>
    );
}

export default function DetailMenu({ params }: PageProps) {
    return (
        <Suspense fallback={<p className="text-center py-10 text-slate-500">Memuat detail menu...</p>}>
            <DetailContent params={params} />
        </Suspense>
    );
}