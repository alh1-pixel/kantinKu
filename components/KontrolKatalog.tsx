type Props = {
  cari: string;
  onCari: (nilai: string) => void;
  kategori: string;
  onKategori: (nilai: string) => void;
  daftarKategori: string[];
  urut: string;
  onUrut: (nilai: string) => void;
  hanyaTersedia: boolean;
  onHanyaTersedia: (nilai: boolean) => void;
  batasHarga: string;
  onBatasHarga: (nilai: string) => void;
};

export default function KontrolKatalog({
  cari,
  onCari,
  kategori,
  onKategori,
  daftarKategori,
  urut,
  onUrut,
  hanyaTersedia,
  onHanyaTersedia,
  batasHarga,
  onBatasHarga,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        value={cari}
        onChange={(e) => onCari(e.target.value)}
        placeholder="Cari menu..." // UBAH: "Cari event..." -> "Cari menu..."
        className="rounded border bg-white px-3 py-2"
      />
      <select
        value={kategori}
        onChange={(e) => onKategori(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => onUrut(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        {/* UBAH: opsi "Tanggal terdekat" dihapus karena menu tidak punya tanggal */}
        <option value="nama">Nama A-Z</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
      </select>
      <input
        type="number"
        min="0"
        value={batasHarga}
        onChange={(e) => onBatasHarga(e.target.value)}
        placeholder="Harga maksimal"
        className="w-40 rounded border bg-white px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={hanyaTersedia}
          onChange={(e) => onHanyaTersedia(e.target.checked)}
        />
        {/* UBAH: "tiket" -> "stok" */}
        Hanya yang masih ada stok
      </label>
    </div>
  );
}
