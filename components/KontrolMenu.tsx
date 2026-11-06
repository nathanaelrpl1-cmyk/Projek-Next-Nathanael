"use client";

type KontrolMenuProps = {
  cari: string;
  setCari: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  daftarKategori: string[];
  urut: string;
  setUrut: (val: string) => void;
  hanyaAdaStok: boolean;
  setHanyaAdaStok: (val: boolean) => void;
  hargaMaksimal: string;
  setHargaMaksimal: (val: string) => void;
  setJumlahTampil: (val: number | ((prev: number) => number)) => void;
};

export default function KontrolMenu({
  cari,
  setCari,
  kategori,
  setKategori,
  daftarKategori,
  urut,
  setUrut,
  hanyaAdaStok,
  setHanyaAdaStok,
  hargaMaksimal,
  setHargaMaksimal,
  setJumlahTampil,
}: KontrolMenuProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <input
        value={cari}
        onChange={(e) => {
          setCari(e.target.value);
          setJumlahTampil(4);
        }}
        placeholder="Cari menu..."
        className="rounded border bg-white px-3 py-2 text-sm"
      />
      <select
        value={kategori}
        onChange={(e) => {
          setKategori(e.target.value);
          setJumlahTampil(4);
        }}
        className="rounded border bg-white px-3 py-2 text-sm"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => {
          setUrut(e.target.value);
          setJumlahTampil(4);
        }}
        className="rounded border bg-white px-3 py-2 text-sm"
      >
        <option value="awal">Urutan awal</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hanyaAdaStok}
          onChange={(e) => {
            setHanyaAdaStok(e.target.checked);
            setJumlahTampil(4);
          }}
          className="rounded border"
        />
        <span className="text-sm">Hanya yang masih ada stok</span>
      </label>

      <input
        type="number"
        value={hargaMaksimal}
        onChange={(e) => {
          setHargaMaksimal(e.target.value);
          setJumlahTampil(4);
        }}
        placeholder="Harga maksimal"
        className="rounded border bg-white px-3 py-2 text-sm w-36"
      />
    </div>
  );
}