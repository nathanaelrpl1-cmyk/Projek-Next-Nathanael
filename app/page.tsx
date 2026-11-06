import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
        Selamat Datang di KantinKu
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-600">
        Nikmati berbagai pilihan makanan, minuman, dan camilan lezat langsung dari kantin sekolah dengan cepat dan mudah.
      </p>
      <div className="mt-8">
        <Link
          href="/menu"
          className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          Lihat Menu Kantin
        </Link>
      </div>
    </main>
  );
}