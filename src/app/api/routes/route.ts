import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const routeSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  gpxText: z.string().min(1),
  polyline: z.array(z.tuple([z.number(), z.number()])).min(1),
  ratings: z.object({
    traffic: z.number().int().min(0).max(10),
    elevation: z.number().int().min(0).max(10),
    scenic: z.number().int().min(0).max(10),
    surface: z.number().int().min(0).max(10),
    safety: z.number().int().min(0).max(10),
    access: z.number().int().min(0).max(10),
  }),
});

export async function GET() {
  const routes = await prisma.route.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(routes);
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = routeSchema.parse(json);
    const created = await prisma.route.create({
      data: {
        title: parsed.title,
        author: parsed.author,
        gpxText: parsed.gpxText,
        polyline: JSON.stringify(parsed.polyline),
        traffic: parsed.ratings.traffic,
        elevation: parsed.ratings.elevation,
        scenic: parsed.ratings.scenic,
        surface: parsed.ratings.surface,
        safety: parsed.ratings.safety,
        access: parsed.ratings.access,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


