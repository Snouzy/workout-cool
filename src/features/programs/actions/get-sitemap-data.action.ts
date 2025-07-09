"use server";

import { ProgramVisibility } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";

export interface SitemapProgramData {
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  updatedAt: Date;
  weeks: {
    weekNumber: number;
    sessions: {
      slug: string;
      slugEn: string;
      slugEs: string;
      slugPt: string;
      slugRu: string;
      slugZhCn: string;
      // updatedAt: Date; // TODO: add this back in when we have a way to update the sitemap
    }[];
  }[];
}

export async function getSitemapData(): Promise<SitemapProgramData[]> {
  try {
    const programs = await prisma.program.findMany({
      where: {
        visibility: ProgramVisibility.PUBLISHED,
        isActive: true,
      },
      select: {
        slug: true,
        slugEn: true,
        slugEs: true,
        slugPt: true,
        slugRu: true,
        slugZhCn: true,
        updatedAt: true,
        weeks: {
          select: {
            weekNumber: true,
            sessions: {
              select: {
                slug: true,
                slugEn: true,
                slugEs: true,
                slugPt: true,
                slugRu: true,
                slugZhCn: true,
              },
              orderBy: {
                sessionNumber: "asc",
              },
            },
          },
          orderBy: {
            weekNumber: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return programs;
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
    return [];
  }
}
