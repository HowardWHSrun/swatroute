// Moved from app/api to avoid blocking static export for GitHub Pages
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const route = await prisma.route.findUnique({ where: { id } });
  if (!route) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(route.gpxText, {
    status: 200,
    headers: {
      "Content-Type": "application/gpx+xml",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(route.title.replace(/\s+/g, "_"))}.gpx"`,
    },
  });
}


