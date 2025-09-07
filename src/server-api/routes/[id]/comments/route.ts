// Moved from app/api to avoid blocking static export for GitHub Pages
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  author: z.string().min(1),
  body: z.string().min(1),
  ratings: z
    .object({
      traffic: z.number().int().min(0).max(10).optional(),
      elevation: z.number().int().min(0).max(10).optional(),
      scenic: z.number().int().min(0).max(10).optional(),
      surface: z.number().int().min(0).max(10).optional(),
      safety: z.number().int().min(0).max(10).optional(),
      access: z.number().int().min(0).max(10).optional(),
    })
    .optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { routeId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = commentSchema.parse(json);
    const created = await prisma.comment.create({
      data: {
        routeId: id,
        author: parsed.author,
        body: parsed.body,
        traffic: parsed.ratings?.traffic ?? null,
        elevation: parsed.ratings?.elevation ?? null,
        scenic: parsed.ratings?.scenic ?? null,
        surface: parsed.ratings?.surface ?? null,
        safety: parsed.ratings?.safety ?? null,
        access: parsed.ratings?.access ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


