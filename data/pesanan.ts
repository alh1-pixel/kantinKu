export type Pesanan = {
  nomor: number;
  eventId: number;
  judul: string;
  nama: string;
  email: string;
  jumlah: number;
  total: number;
  waktu: string;
};

// Disimpan di memori server: hilang setiap kali server dimatikan.
export const pesanan: Pesanan[] = [];

let nomorTerakhir = 0;

export function tambahPesanan(data: Omit<Pesanan, "nomor">) {
  nomorTerakhir += 1;
  pesanan.unshift({ nomor: nomorTerakhir, ...data });
  return nomorTerakhir;
}
