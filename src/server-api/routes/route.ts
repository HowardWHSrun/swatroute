// Moved from app/api to avoid blocking static export for GitHub Pages
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/prisma";

const int0to10 = z.preprocess((v) => (typeof v === "string" ? parseInt(v, 10) : v), z.number().int().min(0).max(10));

const polylineSchema = z
  .union([
    z.array(z.tuple([z.number(), z.number()])),
    z.string().transform((s, ctx) => {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid polyline JSON" });
      return z.NEVER;
    }),
  ])
  .transform((val) => val as [number, number][])
  .refine((arr) => Array.isArray(arr) && arr.length > 0, {
    message: "Polyline must be a non-empty array",
  });

const routeSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  gpxText: z.string().min(1),
  polyline: polylineSchema,
  ratings: z.object({
    traffic: int0to10,
    elevation: int0to10,
    scenic: int0to10,
    surface: int0to10,
    safety: int0to10,
    access: int0to10,
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
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


