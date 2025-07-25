import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  muscle: z.string().optional(),
  equipment: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get user session for authentication
    // const session = await getMobileCompatibleSession(request);
    // const user = session?.user;

    // if (!user) {
    //   return NextResponse.json({ error: "UNAUTHORIZED", message: "Authentication required" }, { status: 401 });
    // }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      search: searchParams.get("search") || undefined,
      muscle: searchParams.get("muscle") || undefined,
      equipment: searchParams.get("equipment") || undefined,
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

    const { page, limit, search, muscle, equipment } = parsed.data;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};
    const conditions = [];

    // Search by exercise name
    if (search) {
      conditions.push({
        OR: [{ name: { contains: search, mode: "insensitive" } }, { nameEn: { contains: search, mode: "insensitive" } }],
      });
    }

    // Build attribute filters array
    const attributeFilters = [];

    // Filter by muscle group
    if (muscle) {
      attributeFilters.push({
        attributeName: { name: "PRIMARY_MUSCLE" },
        attributeValue: { value: muscle },
      });
    }

    // Filter by equipment
    if (equipment) {
      attributeFilters.push({
        attributeName: { name: "EQUIPMENT" },
        attributeValue: { value: equipment },
      });
    }

    // Apply attribute filters (AND logic - exercise must have ALL specified attributes)
    if (attributeFilters.length > 0) {
      conditions.push(
        ...attributeFilters.map((filter) => ({
          attributes: {
            some: filter,
          },
        })),
      );
    }

    // Combine all conditions with AND logic
    if (conditions.length > 0) {
      whereClause.AND = conditions;
    }

    // Get total count for pagination
    const totalCount = await prisma.exercise.count({ where: whereClause });

    // Fetch exercises with pagination
    const exercises = await prisma.exercise.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nameEn: true,
        fullVideoUrl: true,
        fullVideoImageUrl: true,
        attributes: {
          select: {
            id: true,
            attributeName: {
              select: { name: true },
            },
            attributeValue: {
              select: { value: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
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

    // Add cache headers - 5 minutes cache
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
