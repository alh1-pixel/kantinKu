import { menu } from "@/data/menu";

export async function GET(_req: Request, ctx: RouteContext<"/api/menu/[id]">) {
  const { id } = await ctx.params;
  const item = menu.find((m) => m.id === Number(id));

  if (!item) {
    return Response.json({ pesan: "Menu tidak ditemukan" }, { status: 404 });
  }
  return Response.json(item);
}
