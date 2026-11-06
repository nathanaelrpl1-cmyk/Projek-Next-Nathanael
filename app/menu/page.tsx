import { menu } from "@/data/menu";
import KatalogMenu from "@/components/KatalogMenuInteraktif";

export default function MenuPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Daftar Menu Kantin</h1>
      <KatalogMenu daftarMenu={menu} />
    </main>
  );
}