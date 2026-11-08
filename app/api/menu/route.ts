import { menu } from "@/data/menu";

export async function Get() {
  return Response.json(menu);
}
