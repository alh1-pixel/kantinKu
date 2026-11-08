"use client";
import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";
import { bacaRiwayat, type Pesanan } from "@/lib/keranjang";

function formatWaktu(iso?: string) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function DaftarRiwayat() {
  const [riwayat, setRIwayat] = useState<Pesanan[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRIwayat(bacaRiwayat());
  }, []);

  if (riwayat === null) return <p>Memuat...</p>;
  if (riwayat.length === 0)
    return <p className="text-slate-500">Belum ada pesanan</p>;

  const totalBelanja = riwayat.reduce((n, p) => n + (p.total ?? 0), 0);

  return (
    <div className="space-y-4">
      <p className="font-semibold">
        {riwayat.length} pesanan, total belanja {rupiah(totalBelanja)}
      </p>
      <ul className="space-y-3">
        {riwayat.map((p, i) => (
          <li
            key={`${p.waktu}-${i}`}
            className="rounded-xl border bg-white p-4 text-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{p.nama}</p>
              <p className="text-sm text-slate-500">{formatWaktu(p.waktu)}</p>
            </div>
            <ul className="mt-2 space-y-1">
              {(p.baris ?? []).map((b) => (
                <li key={b.nama}>
                  {b.nama} x{b.jumlah} = {rupiah(b.subtotal)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-600">
              {p.caraAmbil === "antar"
                ? `Diantar ke ${p.kelas}`
                : "Diambil sendiri di kantin"}
            </p>
            <p className="mt-1 font-bold">Total: {rupiah(p.total)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
