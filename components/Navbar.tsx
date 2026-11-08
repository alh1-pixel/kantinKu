"use client";
import { totalItem } from "@/lib/keranjang";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { href: "/", teks: "Beranda" },
  { href: "/menu", teks: "Menu" },
  { href: "/favorit", teks: "Favorit" },
  { href: "/keranjang", teks: "Keranjang" },
  { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

  useEffect(() => {
    const hitung = () => setJumlahKeranjang(totalItem());
    hitung();
    window.addEventListener("keranjang-berubah", hitung);

    return () => window.removeEventListener("keranjang-berubah", hitung);
  }, []);

  return (
    <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
      <span className="text-lg font-bold text-blue-600">KantinKu</span>
      {menu.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={
            pathname === m.href
              ? "font-semibold text-blue-600"
              : "text-slate-600 hover:text-blue-600"
          }
        >
          {m.href === "/keranjang" && jumlahKeranjang > 0
            ? `${m.teks} (${jumlahKeranjang})`
            : m.teks}
        </Link>
      ))}
    </nav>
  );
}
