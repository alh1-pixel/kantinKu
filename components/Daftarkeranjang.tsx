"use client";
import { useEffect, useState } from "react";
import { menu, rupiah } from "@/data/menu";
import {
  MIN_PROMO,
  ONGKIR,
  KODE_PROMO,
  bacaKeranjang,
  cekKodePromo,
  hitungDiskon,
  hitungSubtotal,
  simpanKeranjang,
  simpanRiwayat,
  type ItemKeranjang,
  type Pesanan,
} from "@/lib/keranjang";

type CaraAmbil = "ambil" | "antar";

function Struk({ pesanan }: { pesanan: Pesanan }) {
  return (
    <section className="rounded-xl border border-green-200 bg-green-50 p-4">
      <p className="font-semibold text-green-800">
        Terima kasih, {pesanan.nama}!
      </p>
      <ul className="mt-2 space-y-1">
        {pesanan.baris.map((b) => (
          <li
            key={b.nama}
          >{`${b.nama} x${b.jumlah} = ${rupiah(b.subtotal)}`}</li>
        ))}
      </ul>
      <p className="mt-2">Subtotal: {rupiah(pesanan.subtotal)}</p>
      {pesanan.diskon > 0 && <p>Diskon: -{rupiah(pesanan.diskon)}</p>}
      <p>
        {pesanan.caraAmbil === "antar"
          ? `Ongkir antar ke ${pesanan.kelas}: ${rupiah(pesanan.ongkir)}`
          : "Diambil sendiri di kantin"}
      </p>
      <p className="mt-2 font-bold">Total bayar: {rupiah(pesanan.total)}</p>
    </section>
  );
}

// Diadaptasi dari DaftarFavorit.tsx (referensi): baca localStorage di useEffect, lalu cocokkan dengan data menu.
export default function DaftarKeranjang() {
  // null = belum selesai dibaca dari localStorage
  const [isi, setIsi] = useState<ItemKeranjang[] | null>(null);
  const [kodeInput, setKodeInput] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");
  const [cara, setCara] = useState<CaraAmbil>("ambil");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [galat, setGalat] = useState("");
  const [struk, setStruk] = useState<Pesanan | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsi(bacaKeranjang());
  }, []);

  if (isi === null) return <p>Memuat...</p>;

  const baris = isi.flatMap((x) => {
    const m = menu.find((k) => k.id === x.id);
    return m
      ? [{ item: m, jumlah: x.jumlah, subtotal: m.harga * x.jumlah }]
      : [];
  });
  const subtotal = hitungSubtotal(isi);
  const diskon = promoAktif ? hitungDiskon(subtotal) : 0;
  const ongkir = cara === "antar" ? ONGKIR : 0;
  const total = subtotal - diskon + ongkir;

  // Semua perubahan isi keranjang lewat sini: simpan (sekaligus memberi kabar ke Navbar), lalu cek promo.
  function perbarui(baru: ItemKeranjang[]) {
    simpanKeranjang(baru);
    setIsi(baru);
    if (promoAktif && hitungSubtotal(baru) < MIN_PROMO) {
      // subtotal turun di bawah batas: diskon otomatis tidak berlaku lagi
      setPromoAktif(false);
      setPesanPromo(cekKodePromo(KODE_PROMO, hitungSubtotal(baru)).pesan);
    }
  }

  function ubahJumlah(id: number, jumlahBaru: number) {
    const m = menu.find((k) => k.id === id);
    if (!m || jumlahBaru < 1 || jumlahBaru > m.stok) return;
    perbarui(
      (isi ?? []).map((x) => (x.id === id ? { ...x, jumlah: jumlahBaru } : x)),
    );
  }

  function hapus(id: number) {
    perbarui((isi ?? []).filter((x) => x.id !== id));
  }

  function pakaiPromo() {
    const hasil = cekKodePromo(kodeInput, subtotal);
    setPromoAktif(hasil.berhasil);
    setPesanPromo(hasil.pesan);
  }

  function pesanSekarang(e: React.FormEvent) {
    e.preventDefault();
    const namaBersih = nama.trim();
    const kelasBersih = kelas.trim();
    if (namaBersih.length < 3) return setGalat("Nama pemesan minimal 3 huruf.");
    if (cara === "antar" && kelasBersih.length < 3)
      return setGalat("Kelas wajib diisi, minimal 3 karakter.");

    const pesanan: Pesanan = {
      nama: namaBersih,
      caraAmbil: cara,
      kelas: cara === "antar" ? kelasBersih : "",
      baris: baris.map((b) => ({
        nama: b.item.nama,
        jumlah: b.jumlah,
        subtotal: b.subtotal,
      })),
      subtotal,
      diskon,
      ongkir,
      total,
    };
    simpanRiwayat(pesanan);
    simpanKeranjang([]);
    setStruk(pesanan);
    setStruk(pesanan);

    setIsi([]);
    setNama("");
    setKelas("");
    setCara("ambil");
    setKodeInput("");
    setPromoAktif(false);
    setPesanPromo("");
    setGalat("");
  }

  return (
    <div className="space-y-4">
      {struk && <Struk pesanan={struk} />}

      {baris.length === 0 ? (
        <p className="text-slate-500">Keranjang masih kosong.</p>
      ) : (
        <>
          <ul className="divide-y rounded-xl border bg-white">
            {baris.map((b) => (
              <li
                key={b.item.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="min-w-40">
                  <p className="font-semibold">{b.item.nama}</p>
                  <p className="text-sm text-slate-500">
                    {rupiah(b.item.harga)} · Stok {b.item.stok}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Kurangi ${b.item.nama}`}
                    disabled={b.jumlah <= 1}
                    onClick={() => ubahJumlah(b.item.id, b.jumlah - 1)}
                    className="rounded border px-2.5 py-1 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{b.jumlah}</span>
                  <button
                    type="button"
                    aria-label={`Tambah ${b.item.nama}`}
                    disabled={b.jumlah >= b.item.stok}
                    onClick={() => ubahJumlah(b.item.id, b.jumlah + 1)}
                    className="rounded border px-2.5 py-1 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="w-24 text-right font-medium">
                  {rupiah(b.subtotal)}
                </p>
                <button
                  type="button"
                  onClick={() => hapus(b.item.id)}
                  className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>

          <section className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Kode promo</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                value={kodeInput}
                onChange={(e) => setKodeInput(e.target.value)}
                placeholder="Kode promo"
                aria-label="Kode promo"
                className="rounded border bg-white px-3 py-2"
              />
              <button
                type="button"
                onClick={pakaiPromo}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Pakai
              </button>
            </div>
            {pesanPromo && (
              <p
                className={
                  promoAktif ? "mt-2 text-green-700" : "mt-2 text-red-600"
                }
              >
                {pesanPromo}
              </p>
            )}
          </section>

          <fieldset className="rounded-xl border bg-white p-4">
            <legend className="px-1 font-semibold">Cara ambil</legend>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="cara"
                value="ambil"
                checked={cara === "ambil"}
                onChange={() => setCara("ambil")}
              />
              Ambil sendiri
            </label>
            <label className="mt-1 flex items-center gap-2">
              <input
                type="radio"
                name="cara"
                value="antar"
                checked={cara === "antar"}
                onChange={() => setCara("antar")}
              />
              Diantar (+{rupiah(ONGKIR)})
            </label>
          </fieldset>

          <section className="space-y-1 rounded-xl border bg-white p-4">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </p>
            {diskon > 0 && (
              <p className="flex justify-between text-green-700">
                <span>Diskon</span>
                <span>-{rupiah(diskon)}</span>
              </p>
            )}
            {cara === "antar" && (
              <p className="flex justify-between">
                <span>Ongkir</span>
                <span>{rupiah(ongkir)}</span>
              </p>
            )}
            <p className="flex justify-between border-t pt-1 text-lg font-bold">
              <span>Total</span>
              <span>{rupiah(total)}</span>
            </p>
          </section>

          <form
            onSubmit={pesanSekarang}
            className="space-y-3 rounded-xl border bg-white p-4"
          >
            <h2 className="text-lg font-semibold">Pesan sekarang</h2>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama pemesan"
              aria-label="Nama pemesan"
              className="block w-full rounded border bg-white px-3 py-2"
            />
            {cara === "antar" && (
              <input
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Kelas"
                aria-label="Kelas"
                className="block w-full rounded border bg-white px-3 py-2"
              />
            )}
            {galat && <p className="text-red-600">{galat}</p>}
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Pesan sekarang
            </button>
          </form>
        </>
      )}
    </div>
  );
}
