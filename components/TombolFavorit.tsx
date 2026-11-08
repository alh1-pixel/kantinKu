"use client";
import { useEffect, useState } from "react";

function bacaFavorit(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem("favorit") ?? "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export default function TombolFavorit({ id }: { id: number }) {
  const [favorit, setFavorit] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorit(bacaFavorit().includes(id));
  }, [id]);

  function ubah() {
    const simpan = bacaFavorit();
    const baru = simpan.includes(id)
      ? simpan.filter((x) => x !== id)
      : [...simpan, id];
    localStorage.setItem("favorit", JSON.stringify(baru));
    setFavorit(baru.includes(id));
  }
  return (
    <button
      type="button"
      onClick={ubah}
      className="mt-3 rounded border px-3 py-1.5 text-sm text-slate-900"
    >
      {favorit ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}
