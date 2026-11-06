import Link from "next/link";

export default function MenuTidakAda() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Menu tidak ditemukan</h1>
      <p className="mt-2 text-slat-600">
        Mungkin menu ini sudah dihapus atau alamatnya salah
      </p>
      <Link
        href="/menu"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        Kembali ke menu
      </Link>
    </div>
  );
}
