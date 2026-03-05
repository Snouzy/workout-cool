import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  muscle: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      search: searchParams.get("search") || undefined,
      muscle: searchParams.get("muscle") || undefined,
      category: searchParams.get("category") || undefined,
    };

    const parsed = paginationSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "INVALID_PARAMETERS",
          message: "Invalid query parameters",
          details: parsed.error.format(),
        },
        { status: 400 },
      );
    }

    const { page, limit, search, muscle, category } = parsed.data;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    const conditions = [];

    if (search) {
      conditions.push({
        OR: [{ name: { contains: search, mode: "insensitive" } }, { nameEn: { contains: search, mode: "insensitive" } }],
      });
    }

    if (muscle) {
      conditions.push({ primaryMuscles: { has: muscle } });
    }

    if (category) {
      conditions.push({ category });
    }

    if (conditions.length > 0) {
      whereClause.AND = conditions;
    }

    const totalCount = await prisma.exercise.count({ where: whereClause });

    const exercises = await prisma.exercise.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        videoUrl: true,
        imageUrls: true,
        category: true,
        difficultyLevel: true,
        primaryMuscles: true,
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response = {
      data: exercises,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };

    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch exercises",
      },
      { status: 500 },
    );
  }
}
