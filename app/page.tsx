import Link from "next/link";

export default function Home() {
  return (
    <div>
    <section className="py-12 text-center">
      <h1 className="text-4xl font-bold">Selamat datang diKantinku</h1>
      <p className="mt-3 text-slate-600">
        Nikmati Camilan, Makanan, dan Minuman dikantin dengan cepat dan mudah
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
      >
        Lihat semua event
      </Link>
    </section>
    </div>
  );
}