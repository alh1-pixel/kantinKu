import { menu } from "@/data/menu";
import KatalogInteraktif from "@/components/KatalogInteraktif";

export default function HalamanMenu() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Menu Kantin</h1>
      <KatalogInteraktif items={menu} />
    </div>
  );
}
