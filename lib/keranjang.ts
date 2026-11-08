import { menu, rupiah } from "@/data/menu";

// Isi keranjang disimpan di localStorage (kunci "keranjang") berupa larik { id, jumlah }.
export type ItemKeranjang = { id: number; jumlah: number };

export type BarisPesanan = { nama: string; jumlah: number; subtotal: number };

export type Pesanan = {
  nama: string;
  caraAmbil: "ambil" | "antar";
  kelas: string;
  baris: BarisPesanan[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

export const KUNCI_KERANJANG = "keranjang";
export const KUNCI_RIWAYAT = "riwayat";
export const KODE_PROMO = "HEMAT10";
export const MIN_PROMO = 20000;
export const ONGKIR = 2000;

export function bacaKeranjang(): ItemKeranjang[] {
  let mentah: unknown;
  try {
    mentah = JSON.parse(localStorage.getItem(KUNCI_KERANJANG) ?? "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(mentah)) return [];

  const hasil: ItemKeranjang[] = [];
  for (const x of mentah) {
    const id = Number(x?.id);
    const jumlah = Math.floor(Number(x?.jumlah));
    const m = menu.find((k) => k.id === id);
    if (!m || m.stok === 0 || !(jumlah >= 1)) continue;

    const ada = hasil.find((h) => h.id === id);
    if (ada) ada.jumlah = Math.min(ada.jumlah + jumlah, m.stok);
    else hasil.push({ id, jumlah: Math.min(jumlah, m.stok) });
  }
  return hasil;
}

export function simpanKeranjang(isi: ItemKeranjang[]) {
  localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(isi));
  window.dispatchEvent(new Event("keranjang-berubah"));
}

export function totalItem(): number {
  return bacaKeranjang().reduce((n, x) => n + x.jumlah, 0);
}

export function hitungSubtotal(isi: ItemKeranjang[]): number {
  return isi.reduce((n, x) => {
    const m = menu.find((k) => k.id === x.id);
    return m ? n + m.harga * x.jumlah : n;
  }, 0);
}

export function hitungDiskon(subtotal: number): number {
  return subtotal >= MIN_PROMO ? Math.round(subtotal * 0.1) : 0;
}

export function cekKodePromo(
  kode: string,
  subtotal: number,
): { berhasil: boolean; pesan: string } {
  if (kode.trim().toUpperCase() !== KODE_PROMO)
    return { berhasil: false, pesan: "Kode promo tidak dikenal." };
  if (subtotal < MIN_PROMO)
    return {
      berhasil: false,
      pesan: `Promo ${KODE_PROMO} butuh belanja minimal ${rupiah(MIN_PROMO)}.`,
    };
  return { berhasil: true, pesan: `Promo ${KODE_PROMO} dipakai: diskon 10%.` };
}

export function simpanRiwayat(pesanan: Pesanan) {
  let lama: Pesanan[] = [];
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_RIWAYAT) ?? "[]");
    if (Array.isArray(data)) lama = data;
  } catch {
    lama = [];
  }
  localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify([pesanan, ...lama]));
}
