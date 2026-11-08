"use client";
import { useState } from "react";
import { rupiah, type Menu } from "@/data/menu";
import { bacaKeranjang, simpanKeranjang } from "@/lib/keranjang";

export default function FormJumlah({ item }: { item: Menu }) {
  const [isi, setIsi] = useState("1");
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  const jumlah = Number(isi);
  const jumlahValid = Number.isInteger(jumlah) && jumlah >= 1;
  const total = jumlahValid ? item.harga * jumlah : 0;

  function ubah(nilai: string) {
    setIsi(nilai);
    setPesan("");
    setBerhasil(false);
  }

  function tambah(e: React.FormEvent) {
    e.preventDefault();
    setBerhasil(false);
    if (!Number.isInteger(jumlah))
      return setPesan("Jumlah harus berupa bilangan bulat.");
    if (jumlah < 1) return setPesan("Jumlah minimal 1.");

    const keranjang = bacaKeranjang();
    const baris = keranjang.find((k) => k.id === item.id);
    const sudah = baris?.jumlah ?? 0;
    const sisa = item.stok - sudah;
    if (jumlah > sisa) {
      if (sisa === 0)
        return setPesan(
          `Seluruh stok (${item.stok}) sudah ada di keranjang, tidak bisa menambah lagi.`,
        );
      if (sudah > 0)
        return setPesan(
          `Jumlah melebihi stok. Stok ${item.stok}, sudah ${sudah} di keranjang, jadi hanya bisa menambah ${sisa} lagi.`,
        );
      return setPesan(`Jumlah melebihi stok. Stok hanya ${item.stok}.`);
    }

    const baru = baris
      ? keranjang.map((k) =>
          k.id === item.id ? { ...k, jumlah: k.jumlah + jumlah } : k,
        )
      : [...keranjang, { id: item.id, jumlah }];
    simpanKeranjang(baru);
    setPesan("");
    setBerhasil(true);
  }

  return (
    <form onSubmit={tambah} className="mt-6 space-y-3 border-t pt-4">
      <h2 className="text-lg font-semibold">Tambah ke keranjang</h2>
      <label className="block text-sm text-slate-600" htmlFor="jumlah">
        Jumlah
      </label>
      <input
        id="jumlah"
        type="number"
        min="1"
        max={item.stok}
        value={isi}
        onChange={(e) => ubah(e.target.value)}
        className="block w-32 rounded border bg-white px-3 py-2"
      />
      <p>
        Total: <b>{rupiah(total)}</b>
      </p>
      {pesan && <p className="text-red-600">{pesan}</p>}
      {berhasil && <p className="text-green-700">Ditambahkan ke keranjang.</p>}
      <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Tambah ke keranjang
      </button>
    </form>
  );
}
