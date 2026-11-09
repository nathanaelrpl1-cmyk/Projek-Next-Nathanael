import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const item = menu.find((m) => m.id === Number(id));

  if (!item) {
    return NextResponse.json({ pesan: "Menu tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(item);
}