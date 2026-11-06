import Link from "next/link";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";

export default async function DetailMenu({ params }: PageProps<"/menu/[id]">) {
  const { id } = await params;
  const item = menu.find((m) => m.id === Number(id)); // UBAH: events/e -> menu/m
  if (!item) notFound(); // id tidak ada -> halaman 404

  const habis = item.stok === 0;
  return (
    <article className="rounded-xl border bg-white p-6">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {item.kategori}
      </span>
      {/* UBAH: judul -> nama; tanggal/lokasi dihapus */}
      <h1 className="mt-2 text-3xl font-bold">{item.nama}</h1>
      <p className="mt-4 text-xl font-semibold">{rupiah(item.harga)}</p>
      {/* UBAH: "Sisa N dari N tiket" -> stok; FormPesan dan TombolFavorit tidak dibawa */}
      <p className={habis ? "text-red-600" : "text-green-700"}>
        {habis ? "Habis" : `Stok ${item.stok}`}
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Kembali ke menu
      </Link>
    </article>
  );
}
