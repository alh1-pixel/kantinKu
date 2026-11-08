"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { rupiah, type Menu } from "@/data/menu";

export default function DaftarFavorit() {
  const [semua, setSemua] = useState<Menu[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("favorit") ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIds(Array.isArray(data) ? data : []);
    } catch {
      setIds([]);
    }
    fetch("/api/menu")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal mengambil data menu");
        return r.json();
      })
      .then((d: Menu[]) => setSemua(d))
      .catch((e: Error) => setGalat(e.message))
      .finally(() => setMemuat(false));
  }, []);

  if (memuat) return <p>Memuat...</p>;
  if (galat) return <p className="text-red-600">{galat}</p>;

  const daftar = semua.filter((m) => ids.includes(m.id));
  if (daftar.length === 0)
    return <p className="text-slate-500">Belum ada menu favorit</p>;

  return (
    <ul className="space-y-2">
      {daftar.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-4">
          <Link
            href={`/menu/${m.id}`}
            className="text-blue-600 hover:underline"
          >
            {m.nama}
          </Link>
          <span>{rupiah(m.harga)}</span>
        </li>
      ))}
    </ul>
  );
}
