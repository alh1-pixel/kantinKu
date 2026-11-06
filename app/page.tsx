import Link from "next/link";
export default function Beranda() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold">
          Temukan kuliner yang lezat di sekolahmu
        </h1>
        <p className="mt-3 text-slate-600">
          Makanan, minuman, dan camilan. Pesan tiketnya di sini.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Lihat semua menu kuliner yang tersedia
        </Link>
      </section>
    </div>
  );
}
