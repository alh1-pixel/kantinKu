"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", teks: "Beranda" },
  { href: "/menu", teks: "Menu" },
  { href: "/favorit", teks: "Favorit" },
  { href: "/keranjang", teks: "Keranjang" },
  { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
      <span className="text-lg font-bold text-blue-600">EventKu</span>
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
          {m.teks}
        </Link>
      ))}
    </nav>
  );
}
