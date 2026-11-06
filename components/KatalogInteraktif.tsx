"use client";
import { useEffect, useState } from "react";
import { rupiah, type Menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";
import KontrolKatalog from "./KontrolKatalog";

const JUMLAH_AWAL = 4;

// UBAH: prop `events: Event[]` -> `items: Menu[]`
export default function KatalogInteraktif({ items }: { items: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("nama");
  const [tampil, setTampil] = useState(JUMLAH_AWAL);
  const [hanyaTersedia, setHanyaTersedia] = useState(false);
  const [batasHarga, setBatasHarga] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrut(localStorage.getItem("urutMenu") ?? "nama");
  }, []);

  function ubahUrut(nilai: string) {
    setUrut(nilai);
    localStorage.setItem("urutMenu", nilai);
    setTampil(JUMLAH_AWAL);
  }

  const daftarKategori = ["Semua", ...new Set(items.map((m) => m.kategori))];
  const hasil = items.filter(
    (m) =>
      m.nama.toLowerCase().includes(cari.toLowerCase()) && // UBAH: judul -> nama
      (kategori === "Semua" || m.kategori === kategori) &&
      (!hanyaTersedia || m.stok > 0) && // UBAH: terisi < kuota -> stok > 0
      (batasHarga === "" || m.harga <= Number(batasHarga)),
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    return a.nama.localeCompare(b.nama); // UBAH: cabang "tanggal" dihapus, bawaannya nama A-Z
  });

  const totalHarga = tersusun.reduce((jumlah, m) => jumlah + m.harga, 0);
  const rataHarga =
    tersusun.length > 0 ? Math.round(totalHarga / tersusun.length) : 0;
  // UBAH: total sisa tiket (kuota - terisi) -> total stok
  const totalStok = tersusun.reduce((jumlah, m) => jumlah + m.stok, 0);

  const terlihat = tersusun.slice(0, tampil);
  const sisaKartu = tersusun.length - terlihat.length;

  return (
    <div>
      <KontrolKatalog
        cari={cari}
        onCari={(nilai) => {
          setCari(nilai);
          setTampil(JUMLAH_AWAL);
        }}
        kategori={kategori}
        onKategori={(nilai) => {
          setKategori(nilai);
          setTampil(JUMLAH_AWAL);
        }}
        daftarKategori={daftarKategori}
        urut={urut}
        onUrut={ubahUrut}
        hanyaTersedia={hanyaTersedia}
        onHanyaTersedia={(nilai) => {
          setHanyaTersedia(nilai);
          setTampil(JUMLAH_AWAL);
        }}
        batasHarga={batasHarga}
        onBatasHarga={(nilai) => {
          setBatasHarga(nilai);
          setTampil(JUMLAH_AWAL);
        }}
      />
      <p className="mb-1 text-sm text-slate-500">
        {tersusun.length} menu ditemukan {/* UBAH: "event" -> "menu" */}
      </p>
      {tersusun.length > 0 && (
        <p className="mb-3 text-sm text-slate-500">
          {/* UBAH: "Total sisa tiket" -> "Total stok" */}
          Rata-rata harga {rupiah(rataHarga)} · Total stok {totalStok}
        </p>
      )}
      {tersusun.length === 0 ? (
        <p className="text-slate-500">Tidak ada menu yang cocok</p> // UBAH: "event" -> "menu"
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {terlihat.map((m) => (
            // UBAH: <KartuEvent event={e} /> -> <KartuMenu item={m} />
            <KartuMenu key={m.id} item={m} />
          ))}
        </div>
      )}
      {sisaKartu > 0 && (
        <button
          onClick={() => setTampil(tampil + JUMLAH_AWAL)}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Tampilkan lagi ({sisaKartu} lagi)
        </button>
      )}
    </div>
  );
}
